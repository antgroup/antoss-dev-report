import { gsap } from 'gsap';
import { useSwiperSlide } from 'swiper/react';

import { useAppContext } from '@/context';
import { PageId } from '@/pages/types';
import BaseLayout from '@/layouts/BaseLayout';
import RetroComputer from '@/components/RetroComputer';
import PressableButton from '@/components/PressableButton';
import { useRef, useEffect, useState, useMemo } from 'react';
import TextType from '@/components/TextType';
import flightGameScene from './flight-game-scene.svg';
import toyPlane from './toy-plane.svg';
import chessBoardPattern from './chessboard-pattern.svg';
import PixelStyleMonthLabel from './PixelStyleMonthLabel';
import PixelStyleRepoCard from './PixelStyleRepoCard';
import replayButtonNormal from './replay-button-normal.png';
import replayButtonPressed from './replay-button-pressed.png';

import styles from './index.module.scss';

const FlightGamePage = () => {
  const { data } = useAppContext() as {
    data: NonNullable<ReturnType<typeof useAppContext>['data']>;
  };

  const { isActive } = useSwiperSlide();
  const { mostContributeReposEveryMonth, mostContributeReposEveryMonthIsAntRepo } = data;

  // Refs
  const textRef = useRef<HTMLDivElement>(null);
  const planeRef = useRef<HTMLImageElement>(null);
  const replayButtonRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<HTMLDivElement>(null);
  const repoCardRefs = useRef<Array<HTMLAnchorElement | null>>([]);

  const [animationKey, setAnimationKey] = useState(0);
  const [showText, setShowText] = useState(false);
  const [showReplayButton, setShowReplayButton] = useState(false);

  // 初始化repoCard refs数组
  useEffect(() => {
    repoCardRefs.current = repoCardRefs.current.slice(0, 12);
  }, []);

  const playAnimation = () => {
    if (!planeRef.current || !sceneRef.current) {
      return;
    }

    const tl = gsap.timeline();

    // 初始状态：飞机在屏幕下方、重播按钮隐藏、文案隐藏
    gsap.set(planeRef.current, {
      bottom: -700,
      opacity: 1,
    });
    setShowText(false);
    setShowReplayButton(false);

    // 0.2s后显示文案
    tl.call(() => {
      setShowText(true);
    })
      .to({}, { duration: 0.2 })
      // 文案显示1s
      .to({}, { duration: 3 })
      // 隐藏文案
      .call(() => {
        setShowText(false);
      })
      // 飞机从屏幕下方驶入
      .to(planeRef.current, {
        bottom: -100, // 原始位置
        duration: 1.5,
        ease: 'power2.out',
      })
      // 飞机进入paper，沿中轴线扫过1-12月份
      .to(planeRef.current, {
        bottom: 'calc(100% + 200px)', // 驶离页面上边缘，多加200px确保完全离开
        duration: 5,
        ease: 'none',
        onUpdate: () => {
          // 计算飞机当前位置
          const planeElement = planeRef.current;
          if (!planeElement) return;

          const planeRect = planeElement.getBoundingClientRect();
          const planeCenterY = planeRect.top + planeRect.height / 2;

          // 检查飞机是否经过各个月份的repocard
          // 月份顺序：1, 2, 3, ..., 12（从下往上）
          repoCardRefs.current.forEach((repoCard) => {
            if (!repoCard) return;

            const repoCardRect = repoCard.getBoundingClientRect();
            const repoCardCenterY = repoCardRect.top + repoCardRect.height / 2;

            // 如果飞机经过该repocard（在repocard中心附近±20px范围内）
            if (Math.abs(planeCenterY - repoCardCenterY) < 20) {
              const cardToAnimate = repoCard;
              if (!cardToAnimate.dataset.animated) {
                cardToAnimate.dataset.animated = 'true';
                // 放大再缩小
                gsap.to(cardToAnimate, {
                  scale: 1.2,
                  duration: 0.2,
                  yoyo: true,
                  repeat: 1,
                  ease: 'power2.out',
                  onComplete: () => {
                    if (cardToAnimate) {
                      const cardToReset = cardToAnimate;
                      delete cardToReset.dataset.animated;
                    }
                  },
                });
              }
            }
          });
        },
      })
      // 飞机驶离后，显示重播按钮
      .call(() => {
        setShowReplayButton(true);
      });

    return tl;
  };

  useEffect(() => {
    if (!isActive) {
      // 离开页面时取消动画
      if (planeRef.current) {
        gsap.killTweensOf(planeRef.current);
      }
      repoCardRefs.current.forEach((card) => {
        if (card) {
          gsap.killTweensOf(card);
          if (card.dataset.animated) {
            const cardToReset = card;
            delete cardToReset.dataset.animated;
          }
        }
      });
      return;
    }

    // 进入页面后等待0.5s再自动播放
    let tl: gsap.core.Timeline | null = null;
    const timeoutId = setTimeout(() => {
      const animationTimeline = playAnimation();
      if (animationTimeline) {
        tl = animationTimeline;
      }
    }, 500);

    return () => {
      clearTimeout(timeoutId);
      if (tl) {
        tl.kill();
      }
    };
  }, [isActive, animationKey]);

  const handleReplay = () => {
    // 重置所有repoCard的动画标记
    repoCardRefs.current.forEach((card) => {
      if (card && card.dataset.animated) {
        const cardToReset = card;
        delete cardToReset.dataset.animated;
      }
      if (card) {
        gsap.killTweensOf(card);
        gsap.set(card, { scale: 1 });
      }
    });
    // 重置飞机位置
    if (planeRef.current) {
      gsap.killTweensOf(planeRef.current);
    }
    // 延迟500ms后隐藏按钮并触发重新播放动画，让按钮的pressup动画完成
    setTimeout(() => {
      setShowReplayButton(false);
      setAnimationKey((prev) => prev + 1);
    }, 500);
  };

  const textContent = useMemo(() => {
    return (
      <TextType
        text={['开启 2025 月度项目之旅', '']}
        typingSpeed={70}
        pauseDuration={1000}
        loop={false}
        showCursor
        cursorCharacter="|"
      />
    );
  }, []);

  return (
    <BaseLayout name={PageId.FlightGame} matrixRainBackgroundColor="#1677ff" logoTheme="dark">
      <div className={styles.topArea}>
        <div ref={sceneRef} className={styles.flightGameScene}>
          <img className={styles.scene} src={flightGameScene} />
          <div className={styles.leftColumn}>
            {/* 奇数月份：1, 3, 5, 7, 9, 11 */}
            {[1, 3, 5, 7, 9, 11].reverse().map((month) => {
              const repoIndex = month - 1; // 月份从 1 开始，数组索引从 0 开始
              const repoFullName = mostContributeReposEveryMonth[repoIndex] || '';
              const isAntRepo = mostContributeReposEveryMonthIsAntRepo[repoIndex] || false;
              return (
                <PixelStyleRepoCard
                  key={month}
                  ref={(el) => {
                    repoCardRefs.current[repoIndex] = el;
                  }}
                  repoFullName={repoFullName}
                  isAnt={!!isAntRepo}
                  direction="left"
                />
              );
            })}
          </div>
          <div className={styles.monthLabelContainer}>
            <PixelStyleMonthLabel month="12" />
            <PixelStyleMonthLabel month="11" />
            <PixelStyleMonthLabel month="10" />
            <PixelStyleMonthLabel month="9" />
            <PixelStyleMonthLabel month="8" />
            <PixelStyleMonthLabel month="7" />
            <PixelStyleMonthLabel month="6" />
            <PixelStyleMonthLabel month="5" />
            <PixelStyleMonthLabel month="4" />
            <PixelStyleMonthLabel month="3" />
            <PixelStyleMonthLabel month="2" />
            <PixelStyleMonthLabel month="1" />
          </div>
          <div className={styles.rightColumn}>
            {/* 偶数月份：2, 4, 6, 8, 10, 12 */}
            {[2, 4, 6, 8, 10, 12].reverse().map((month) => {
              const repoIndex = month - 1; // 月份从 1 开始，数组索引从 0 开始
              const repoFullName = mostContributeReposEveryMonth[repoIndex] || '';
              const isAntRepo = mostContributeReposEveryMonthIsAntRepo[repoIndex] || false;
              return (
                <PixelStyleRepoCard
                  key={month}
                  ref={(el) => {
                    repoCardRefs.current[repoIndex] = el;
                  }}
                  repoFullName={repoFullName}
                  isAnt={!!isAntRepo}
                  direction="right"
                />
              );
            })}
          </div>
        </div>
        <RetroComputer variant="printer" onlyDesk className={styles.retroComputer} />
        <img ref={planeRef} className={styles.toyPlane} src={toyPlane} />
      </div>
      <div className={styles.bottomArea}>
        {showText && (
          <div ref={textRef} className={styles.textContainer}>
            {textContent}
          </div>
        )}
        {showReplayButton && (
          <div ref={replayButtonRef}>
            <PressableButton
              className={`${styles.replayButton} swiper-no-swiping`}
              onClick={handleReplay}
              normalImage={replayButtonNormal}
              pressedImage={replayButtonPressed}
              imageAlt="重放"
            />
          </div>
        )}
        <img className={styles.chessBoardPattern} src={chessBoardPattern} />
      </div>
    </BaseLayout>
  );
};

export default FlightGamePage;
