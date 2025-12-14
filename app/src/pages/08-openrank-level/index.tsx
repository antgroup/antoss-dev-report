import { useEffect, useRef } from 'react';
import Marquee from 'react-fast-marquee';
import { useSwiperSlide } from 'swiper/react';
import gsap from 'gsap';

import { useAppContext } from '@/context';
import { PageId } from '@/pages/types';
import BaseLayout from '@/layouts/BaseLayout';
import Avatar from '@/components/Avatar';
import PixelStyleProjectCard from './PixelStyleProjectCard';
import goldMedal from '@/assets/gold-medal.svg';
import { useAvatarUrl } from '@/hooks/useAvatarUrl';
import logo from '@/assets/ant-open-source-logo.png';
import gameController from './game-controller.svg';

import styles from './index.module.scss';

const OpenrankLevelPage = () => {
  const { data } = useAppContext() as {
    data: NonNullable<ReturnType<typeof useAppContext>['data']>;
  };

  const { isActive } = useSwiperSlide();
  const avatarUrl = useAvatarUrl(data.login);

  // 创建 refs 用于动画
  const userRef = useRef<HTMLDivElement>(null);
  const goldMedalRef = useRef<HTMLImageElement>(null);
  const openrankLevelContainerRef = useRef<HTMLDivElement>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const { mostContributeReposEveryMonth, mostContributeReposEveryMonthIsAntRepo } = data;

  // 创建项目卡片数据
  // 先配对两个数组，然后过滤掉空月份，确保两个数组数据对齐
  const projectCards = mostContributeReposEveryMonth
    .map((repoFullName, index) => ({
      repoFullName,
      isAntRepo: Boolean(mostContributeReposEveryMonthIsAntRepo[index]),
      originalIndex: index,
    }))
    .filter((item) => Boolean(item.repoFullName))
    .map((item, index) => ({
      repoFullName: item.repoFullName,
      isAntRepo: item.isAntRepo,
      // 根据索引分配到不同的行，创建错落效果
      row: index % 3, // 0, 1, 2 三行
      id: `${item.repoFullName}-${index}`, // 添加唯一 id
    }));

  // 将卡片按行分组
  const cardsByRow = [
    projectCards.filter((card) => card.row === 0),
    projectCards.filter((card) => card.row === 1),
    projectCards.filter((card) => card.row === 2),
  ];

  // GSAP 动画控制
  useEffect(() => {
    if (!isActive) {
      // 页面未激活时，清理动画并重置状态
      if (userRef.current) {
        gsap.killTweensOf(userRef.current);
        gsap.set(userRef.current, { opacity: 0 });
      }
      if (goldMedalRef.current) {
        gsap.killTweensOf(goldMedalRef.current);
        gsap.set(goldMedalRef.current, { opacity: 0, scale: 0 });
      }
      if (openrankLevelContainerRef.current) {
        gsap.killTweensOf(openrankLevelContainerRef.current);
        gsap.set(openrankLevelContainerRef.current, { opacity: 0, scale: 0 });
      }
      if (scrollContainerRef.current) {
        gsap.killTweensOf(scrollContainerRef.current);
        gsap.set(scrollContainerRef.current, { opacity: 0 });
      }
      return;
    }

    const tl = gsap.timeline();

    // 初始化所有元素为隐藏状态
    if (userRef.current) {
      gsap.set(userRef.current, { opacity: 0 });
    }
    if (goldMedalRef.current) {
      gsap.set(goldMedalRef.current, { opacity: 0, scale: 0 });
    }
    if (openrankLevelContainerRef.current) {
      gsap.set(openrankLevelContainerRef.current, { opacity: 0, scale: 0 });
    }
    if (scrollContainerRef.current) {
      gsap.set(scrollContainerRef.current, { opacity: 0 });
    }

    // 1. 用户信息先出现
    if (userRef.current) {
      tl.to(
        userRef.current,
        {
          opacity: 1,
          duration: 0.4,
          ease: 'power2.out',
        },
        '+=0.2',
      );
    }

    // 2. 贡献值和段位从中心放大出现（弹一弹的感觉）
    if (openrankLevelContainerRef.current) {
      tl.to(
        openrankLevelContainerRef.current,
        {
          opacity: 1,
          scale: 1,
          duration: 0.7,
          ease: 'elastic.out(1, 0.5)', // 弹性缓动，产生弹一弹的感觉
        },
        '+=0.2',
      );
    }

    // 3. 滚动容器出现
    if (scrollContainerRef.current) {
      tl.to(
        scrollContainerRef.current,
        {
          opacity: 1,
          duration: 0.3,
          ease: 'power2.out',
        },
        '+=0',
      );
    }

    // 4. 最后金牌出现，先变大再缩小
    if (goldMedalRef.current) {
      tl.to(
        goldMedalRef.current,
        {
          opacity: 1,
          scale: 1.3, // 先变大到 1.3
          duration: 0.4,
          ease: 'power2.out',
        },
        '+=0.2',
      ).to(goldMedalRef.current, {
        scale: 1, // 再缩小到正常大小
        duration: 0.3,
        ease: 'back.out(1.7)', // 使用 back 缓动，产生回弹效果
      });
    }
  }, [isActive]);

  return (
    <BaseLayout
      name={PageId.OpenrankLevel}
      matrixRainBackgroundColor="#e8e8e8"
      logoTheme="dark"
      hideLogo
    >
      <div className={styles.topArea}>
        <img src={logo} alt="logo" className={styles.logo} />
        <img ref={goldMedalRef} src={goldMedal} alt="medal" className={styles.goldMedal} />
        <div ref={userRef} className={styles.user}>
          <Avatar
            src={avatarUrl}
            className={styles.avatar}
            isAnt={data.isEmployee}
            href={`https://github.com/${data.login}`}
          />
          <div className={styles.userId}>@{data.login}</div>
        </div>
        <div className={styles.centerArea}>
          <div ref={openrankLevelContainerRef} className={styles.openrankLevelContainer}>
            <div className={styles.openRank}>
              <div className={styles.label}>贡献值</div>
              <div className={styles.openRankValue}>{data.totalOpenRank}</div>
            </div>
            <div className={styles.level}>
              <div className={styles.label}>开源段位</div>
              <div className={styles.levelValue}>{data.level}</div>
            </div>
          </div>
        </div>
      </div>
      <div className={styles.bottomArea}>
        <div ref={scrollContainerRef} className={styles.scrollContainer}>
          {cardsByRow.map((rowCards, rowIndex) => {
            const rowKey = rowCards.map((card) => card.id).join('-');
            const delays = [0, 0, 0];
            const speeds = [40, 30, 20];

            return (
              <div key={rowKey} className={styles.scrollRow}>
                <Marquee
                  speed={speeds[rowIndex]}
                  delay={delays[rowIndex]}
                  gradient={false}
                  pauseOnHover
                  autoFill
                  play={isActive}
                  className={styles.marquee}
                >
                  {rowCards.map((card) => (
                    <PixelStyleProjectCard
                      key={card.id}
                      repoFullName={card.repoFullName}
                      isAntRepo={card.isAntRepo}
                      className={styles.projectCard}
                    />
                  ))}
                </Marquee>
              </div>
            );
          })}
        </div>
        <div className={styles.footer}>
          <img src={gameController} alt="game controller" className={styles.gameController} />
        </div>
      </div>
    </BaseLayout>
  );
};

export default OpenrankLevelPage;
