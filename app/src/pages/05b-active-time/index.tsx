import { useAppContext } from '@/context';
import ComputerBottomLayout from '@/layouts/ComputerBottomLayout';
import { PageId } from '@/pages/types';
import { isNightTimeRange } from '@/utils';
import TextType from '@/components/TextType';
import CountUp from '@/components/CountUp';
import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { useSwiperSlide } from 'swiper/react';
import codeWhirlwind from './code-whirlwind.png';

import styles from './index.module.scss';

const ActiveTimePage = () => {
  const { data } = useAppContext() as {
    data: NonNullable<ReturnType<typeof useAppContext>['data']>;
  };

  const { isActive } = useSwiperSlide();
  const { mostActiveHoursStart, mostActiveHoursEnd } = data;

  const [showCountUp, setShowCountUp] = useState(false);
  const [showTextType, setShowTextType] = useState(false);
  const firstLineRef = useRef<HTMLDivElement>(null);
  const secondLineRef = useRef<HTMLDivElement>(null);
  const thirdLineRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);

  // 判断活跃时段是否为深夜，如果是则使用 dark 主题
  const theme = isNightTimeRange(mostActiveHoursStart, mostActiveHoursEnd) ? 'dark' : 'light';

  // GSAP 动画控制
  useEffect(() => {
    if (!isActive) {
      // 离开页面时重置状态
      setShowCountUp(false);
      setShowTextType(false);
      // 重置所有元素状态
      if (firstLineRef.current) {
        gsap.killTweensOf(firstLineRef.current);
        gsap.set(firstLineRef.current, { opacity: 0 });
      }
      if (secondLineRef.current) {
        gsap.killTweensOf(secondLineRef.current);
        gsap.set(secondLineRef.current, { opacity: 0 });
      }
      if (thirdLineRef.current) {
        gsap.killTweensOf(thirdLineRef.current);
        gsap.set(thirdLineRef.current, { opacity: 0 });
      }
      if (imageRef.current) {
        gsap.killTweensOf(imageRef.current);
        gsap.set(imageRef.current, { opacity: 0, y: 50 });
      }
      return;
    }

    const tl = gsap.timeline();

    // 设置初始状态
    if (firstLineRef.current) {
      gsap.set(firstLineRef.current, { opacity: 0 });
    }
    if (secondLineRef.current) {
      gsap.set(secondLineRef.current, { opacity: 0 });
    }
    if (thirdLineRef.current) {
      gsap.set(thirdLineRef.current, { opacity: 0 });
    }
    if (imageRef.current) {
      gsap.set(imageRef.current, { opacity: 0, y: 50 });
    }

    // 第一行文字出现
    if (firstLineRef.current) {
      tl.to(
        firstLineRef.current,
        {
          opacity: 1,
          y: 0,
          duration: 0.5,
          ease: 'cubic-bezier(0, 0, 0.5, 1)',
        },
        0,
      ).call(
        () => {
          setShowCountUp(true);
        },
        [],
        0.2,
      );
    }

    // 第二行文字出现
    if (secondLineRef.current) {
      tl.to(
        secondLineRef.current,
        {
          opacity: 1,
          y: 0,
          duration: 0.5,
          ease: 'cubic-bezier(0, 0, 0.5, 1)',
        },
        '+=1.6',
      );
    }

    // 第三行文字出现（TextType）
    if (thirdLineRef.current) {
      tl.to(
        thirdLineRef.current,
        {
          opacity: 1,
          y: 0,
          duration: 0.5,
          ease: 'cubic-bezier(0, 0, 0.5, 1)',
        },
        '+=0.5',
      ).call(
        () => {
          setShowTextType(true);
        },
        [],
        '<',
      );
    }

    // 图片从下方浮现
    if (imageRef.current) {
      tl.to(
        imageRef.current,
        {
          opacity: 1,
          y: 0,
          duration: 2,
          ease: 'cubic-bezier(0, 0, 0.5, 1)',
        },
        '+=1',
      );
    }

    return () => {
      tl.kill();
    };
  }, [isActive]);

  return (
    <ComputerBottomLayout
      name={PageId.ActiveTime}
      theme={theme}
      matrixRainBackgroundColor="#e8e8e8"
      topContent={
        <div className={styles.topContent} style={{ color: theme === 'dark' ? 'white' : 'black' }}>
          <div className={styles.year}>2025</div>
          <div>在吗？在码！</div>
        </div>
      }
      paperContent={
        <div className={styles.paperContent}>
          {/* 顶部区域 */}
          <div className={styles.topArea}>
            <div ref={firstLineRef}>
              <span>你通常在</span>
              <span className={styles.timespan}>
                {showCountUp ? (
                  <>
                    <CountUp from={0} to={mostActiveHoursStart} duration={1.5} delay={0} />
                    :00-
                    <CountUp from={0} to={mostActiveHoursEnd} duration={1.5} delay={0.3} />
                    :00
                  </>
                ) : (
                  `0:00-0:00`
                )}
              </span>
              <span>比较活跃，</span>
            </div>
            <div ref={secondLineRef}>这个时段，Coding 时是不是</div>
            <div ref={thirdLineRef}>
              {showTextType ? (
                <TextType
                  text="灵感在喷发呢？"
                  typingSpeed={75}
                  pauseDuration={1000}
                  loop={false}
                  showCursor={false}
                />
              ) : (
                ''
              )}
            </div>
          </div>
          {/* 底部区域 - 骚话 */}
          <div className={styles.bottomArea}>
            <img
              ref={imageRef}
              className={styles.codeWhirlwind}
              src={codeWhirlwind}
              alt="code whirlwind"
            />
          </div>
        </div>
      }
    />
  );
};

export default ActiveTimePage;
