import { useEffect, useMemo, useRef, useState } from 'react';
import { useAppContext } from '@/context';
import ComputerBottomLayout from '@/layouts/ComputerBottomLayout';
import CodingManAndMoon from '@/components/CodingManAndMoon';
import CountUp from '@/components/CountUp';
import { PageId } from '@/pages/types';
import { ellipsisMiddle, getRepoEventTypeLabel, getRepoEventActionLabel } from '@/utils';
import { useSwiperSlide } from 'swiper/react';
import gsap from 'gsap';

import styles from './index.module.scss';

const NightTimePage = () => {
  const { data } = useAppContext() as {
    data: NonNullable<ReturnType<typeof useAppContext>['data']>;
  };

  const { isActive } = useSwiperSlide();
  const [showCountUp, setShowCountUp] = useState(false);

  // 创建 refs 用于动画
  const timeRef = useRef<HTMLDivElement>(null);
  const youStillInRef = useRef<HTMLDivElement>(null);
  const actionTypeRef = useRef<HTMLDivElement>(null);
  const bodyTextRef = useRef<HTMLDivElement>(null);
  const centerAreaRef = useRef<HTMLDivElement>(null);
  const globalDevelopersRef = useRef<HTMLDivElement>(null);

  const {
    loveRepoMonth,
    loveRepoDay,
    loveRepoHour,
    loveRepoName,
    loveRepoType,
    loveRepoAction,
    loveRepoNumber,
    loveRepoBody,
    loveRepoOnlineDevelopersCount,
  } = data;

  // 判断时间描述：凌晨2-5点显示"凌晨"，其他深夜时段显示"深夜"
  const timeDescription = [2, 3, 4, 5].includes(loveRepoHour) ? '凌晨' : '深夜';

  // 获取动作和类型的文案
  const actionLabel = getRepoEventActionLabel(loveRepoType, loveRepoAction);
  const typeLabel = getRepoEventTypeLabel(loveRepoType);

  // 处理内容文本
  const bodyText = useMemo(() => {
    return loveRepoBody
      ? ellipsisMiddle(typeof loveRepoBody === 'string' ? loveRepoBody : loveRepoBody.message, 300)
      : '';
  }, [loveRepoBody]);

  // GSAP 动画控制
  useEffect(() => {
    if (!isActive) {
      // 页面未激活时，清理动画并重置状态
      // 重置状态
      setShowCountUp(false);
      const refs = [
        timeRef.current,
        youStillInRef.current,
        actionTypeRef.current,
        bodyTextRef.current,
        centerAreaRef.current,
        globalDevelopersRef.current,
      ];
      refs.forEach((ref) => {
        if (ref) {
          gsap.killTweensOf(ref);
          gsap.set(ref, { opacity: 0, y: 20 });
        }
      });
      return;
    }

    const tl = gsap.timeline();

    // 初始化所有元素为隐藏状态
    if (timeRef.current) {
      gsap.set(timeRef.current, { opacity: 0, y: 20 });
    }
    if (youStillInRef.current) {
      gsap.set(youStillInRef.current, { opacity: 0, y: 20 });
    }
    if (actionTypeRef.current) {
      gsap.set(actionTypeRef.current, { opacity: 0, y: 20 });
    }
    if (bodyTextRef.current) {
      gsap.set(bodyTextRef.current, { opacity: 0 });
    }
    if (centerAreaRef.current) {
      gsap.set(centerAreaRef.current, { opacity: 0, y: 20 });
    }
    if (globalDevelopersRef.current) {
      gsap.set(globalDevelopersRef.current, { opacity: 0 });
    }

    // 按顺序播放动画
    if (timeRef.current) {
      tl.to(
        timeRef.current,
        {
          opacity: 1,
          y: 0,
          duration: 0.4,
          ease: 'power2.out',
        },
        '+=0',
      );
    }

    if (youStillInRef.current) {
      tl.to(
        youStillInRef.current,
        {
          opacity: 1,
          y: 0,
          duration: 0.4,
          ease: 'power2.out',
        },
        '+=0.2',
      );
    }

    if (actionTypeRef.current) {
      tl.to(
        actionTypeRef.current,
        {
          opacity: 1,
          y: 0,
          duration: 0.4,
          ease: 'power2.out',
        },
        '+=0.2',
      );
    }

    if (bodyTextRef.current && bodyText) {
      tl.to(
        bodyTextRef.current,
        {
          opacity: 1,
          duration: 0.8,
          ease: 'power2.out',
        },
        '+=0.2',
      );
    }

    if (centerAreaRef.current) {
      tl.to(
        centerAreaRef.current,
        {
          opacity: 1,
          y: 0,
          duration: 0.4,
          ease: 'power2.out',
          onComplete: () => {
            setShowCountUp(true);
          },
        },
        '+=0.5',
      );
    }

    if (globalDevelopersRef.current) {
      tl.to(
        globalDevelopersRef.current,
        {
          opacity: 1,
          duration: 1.5,
          ease: 'power2.out',
        },
        '+=2.5',
      );
    }
  }, [isActive, bodyText]);

  return (
    <ComputerBottomLayout
      name={PageId.NightTime}
      theme="dark"
      topContent={
        <div className={styles.topContent}>
          <div className={styles.year}>2025</div>
          <div>在吗？在码！</div>
        </div>
      }
      paperContent={
        <div className={styles.paperContent}>
          {/* 顶部区域 - 时间信息 */}
          <div className={styles.topArea}>
            <div ref={timeRef} className={styles.time}>
              <span className={`${styles.highlight} ${styles.number}`}>{loveRepoMonth}</span>
              <span>月</span>
              <span className={`${styles.highlight} ${styles.number}`}>{loveRepoDay}</span>
              <span>日的{timeDescription}</span>
              <span className={`${styles.highlight} ${styles.number}`}>{loveRepoHour}</span>
              <span>点，</span>
            </div>
            <div ref={youStillInRef}>
              <span>你还在</span>
              <span className={styles.highlight}> {loveRepoName} </span>
            </div>
            <div ref={actionTypeRef}>
              <span>中</span>
              <span>{actionLabel}</span>
              <span className={styles.highlight}> {typeLabel} </span>
              {loveRepoNumber !== 0 && <span className={styles.highlight}>#{loveRepoNumber}</span>}
            </div>
            {bodyText && (
              <div ref={bodyTextRef} className={styles.bodyText}>
                {bodyText}
              </div>
            )}
          </div>
          {/* 中间区域 */}
          <div ref={centerAreaRef} className={styles.centerArea}>
            <div>
              同一时间，全球有
              {showCountUp ? (
                <CountUp
                  to={loveRepoOnlineDevelopersCount}
                  className={styles.globalDeveloperCount}
                />
              ) : (
                <span className={styles.globalDeveloperCount}>--</span>
              )}
              位开发者
            </div>
            <div>和你一起在线</div>
          </div>
          {/* 底部区域 */}
          <div ref={globalDevelopersRef} className={styles.bottomArea}>
            <div className={styles.left}>
              <div>白天属于工作，</div>
              <div>夜晚属于技术与热爱</div>
            </div>
            <div className={styles.right}>
              <div>
                <CodingManAndMoon />
              </div>
            </div>
          </div>
        </div>
      }
    />
  );
};

export default NightTimePage;
