import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { useSwiperSlide } from 'swiper/react';

import { SWIPER_DELAY } from '@/constants';
import { useAppContext } from '@/context';
import githubLogo from '@/assets/github-logo.svg';
import ComputerTopLayout from '@/layouts/ComputerTopLayout';
import { PageId } from '@/pages/types';
import ReportCover from '@/components/ReportCover';
import FormattedNumber from '@/components/FormattedNumber';
import Avatar from '@/components/Avatar';
import { useAvatarUrl } from '@/hooks/useAvatarUrl';
import CountUp from '@/components/CountUp';
import AnimatedContributionGraph, {
  AnimatedContributionGraphRef,
} from '@/components/AnimatedContributionGraph';

import styles from './index.module.scss';

const SummaryPage = () => {
  const { data } = useAppContext() as {
    data: NonNullable<ReturnType<typeof useAppContext>['data']>;
  };

  const { isActive } = useSwiperSlide();
  const avatarUrl = useAvatarUrl(data.login);
  const centerAreaRef = useRef<HTMLDivElement>(null);
  const [isCentered, setIsCentered] = useState(true);

  // 动画元素 refs
  const topAreaRef = useRef<HTMLDivElement>(null);
  const centerItemsRefs = useRef<Array<HTMLDivElement | null>>([]);
  const centerNumberRefs = useRef<Array<HTMLSpanElement | null>>([]);
  const bottomAreaRef = useRef<HTMLDivElement>(null);

  // CountUp 显示控制
  const [showActiveDaysCountUp, setShowActiveDaysCountUp] = useState(false);
  const [showOpenRankCountUp, setShowOpenRankCountUp] = useState(false);

  // 控制显示 ReportCover 还是 AnimatedContributionGraph
  const [showGraph, setShowGraph] = useState(false);
  const graphRef = useRef<AnimatedContributionGraphRef>(null);

  useEffect(() => {
    const checkOverflow = () => {
      if (centerAreaRef.current) {
        const { scrollHeight, clientHeight } = centerAreaRef.current;
        // 如果内容高度小于等于容器高度，则居中显示
        setIsCentered(scrollHeight <= clientHeight);
      }
    };

    // 初始检查
    checkOverflow();

    // 监听窗口大小变化
    window.addEventListener('resize', checkOverflow);

    // 使用 MutationObserver 监听内容变化
    const observer = new MutationObserver(checkOverflow);
    if (centerAreaRef.current) {
      observer.observe(centerAreaRef.current, {
        childList: true,
        subtree: true,
        characterData: true,
      });
    }

    return () => {
      window.removeEventListener('resize', checkOverflow);
      observer.disconnect();
    };
  }, [data]);

  // GSAP 动画控制
  useEffect(() => {
    if (!isActive) {
      // 离开页面时重置状态和动画
      setTimeout(() => {
        setShowActiveDaysCountUp(false);
        setShowOpenRankCountUp(false);
        setShowGraph(false);
      }, SWIPER_DELAY);

      // 清理所有动画
      if (topAreaRef.current) {
        gsap.killTweensOf(topAreaRef.current);
      }
      centerItemsRefs.current.forEach((item) => {
        if (item) {
          gsap.killTweensOf(item);
        }
      });
      centerNumberRefs.current.forEach((number) => {
        if (number) {
          gsap.killTweensOf(number);
        }
      });
      if (bottomAreaRef.current) {
        gsap.killTweensOf(bottomAreaRef.current);
      }
      return;
    }

    // 初始化所有元素为隐藏状态
    gsap.set(topAreaRef.current, { opacity: 0 });
    centerItemsRefs.current.forEach((item) => {
      if (item) {
        gsap.set(item, { opacity: 0 });
      }
    });
    centerNumberRefs.current.forEach((number) => {
      if (number) {
        gsap.set(number, { scale: 1 });
      }
    });
    gsap.set(bottomAreaRef.current, { opacity: 0 });

    // 创建动画时间线
    const tl = gsap.timeline();

    // 顶部区域动画（-0.1s 延迟，即立即开始）
    tl.to(topAreaRef.current, {
      opacity: 1,
      y: 0,
      duration: 0.5,
      ease: 'cubic-bezier(0, 0, 0.5, 1)',
    });

    // 中间区域各项动画
    centerItemsRefs.current.forEach((item, index) => {
      if (item) {
        // 第一个项在顶部区域动画完成后开始（0.5s），后续项依次延迟 0.5s
        const delay = 0.5 + index * 0.5; // 0.5s, 1s, 1.5s, 2s, 2.5s, 3s
        tl.to(
          item,
          {
            opacity: 1,
            y: 0,
            duration: 0.5,
            ease: 'cubic-bezier(0, 0, 0.5, 1)',
          },
          delay,
        );

        // 同时为对应的数字添加放大再缩小的弹性动画
        const numberEl = centerNumberRefs.current[index];
        if (numberEl) {
          tl.to(
            numberEl,
            {
              scale: 1.2,
              duration: 0.3,
              ease: 'power2.out',
            },
            delay + 0.2, // 在文字出现后稍微延迟一点
          ).to(
            numberEl,
            {
              scale: 1,
              duration: 0.4,
              ease: 'back.out(1.7)', // 弹性效果，让数字回弹到原大小
            },
            delay + 0.5,
          );
        }
      }
    });

    // 底部区域动画（最后一个中间项完成后开始，即 3.5s）
    tl.to(
      bottomAreaRef.current,
      {
        opacity: 1,
        y: 0,
        duration: 0.5,
        ease: 'cubic-bezier(0, 0, 0.5, 1)',
      },
      3.5,
    )
      // 显示活跃天数 CountUp（底部区域动画完成后，即 4.0s）
      .call(
        () => {
          setShowActiveDaysCountUp(true);
        },
        [],
        4.0,
      )
      // 显示贡献值 CountUp（底部区域动画完成后，即 4.0s）
      .call(
        () => {
          setShowOpenRankCountUp(true);
        },
        [],
        4.0,
      )
      // CountUp 动画持续 1 秒，在 6.5s 时切换并播放 graph 动画
      .call(
        () => {
          setShowGraph(true);
          // 等待 DOM 更新后调用 play
          setTimeout(() => {
            graphRef.current?.play();
          }, 500);
        },
        [],
        6.5,
      );

    return () => {
      tl.kill();
    };
  }, [isActive, data]);

  return (
    <ComputerTopLayout
      name={PageId.Summary}
      screenContent={
        <div className={styles.screenContent}>
          {showGraph ? (
            <div className={styles.contributionGraph}>
              <AnimatedContributionGraph ref={graphRef} contributionDays={data.activeDays} />
            </div>
          ) : (
            <ReportCover />
          )}
        </div>
      }
      paperContent={
        <div className={styles.paperContent}>
          {/* 顶部区域 */}
          <div ref={topAreaRef} className={styles.topArea}>
            <Avatar
              src={avatarUrl}
              className={styles.avatar}
              isAnt={data.isEmployee}
              href={`https://github.com/${data.login}`}
            />
            <div className={styles.userId}>@{data.login}</div>
          </div>
          {/* 中间区域 */}
          <div
            ref={centerAreaRef}
            className={`${styles.centerArea} ${isCentered ? styles.centered : ''} ${isCentered ? '' : 'swiper-no-swiping'}`}
          >
            {/* 第一组 */}
            <div
              ref={(el) => {
                centerItemsRefs.current[0] = el;
              }}
            >
              今年参与项目
              <span
                ref={(el) => {
                  centerNumberRefs.current[0] = el;
                }}
                className={styles.number}
              >
                <FormattedNumber value={data.participateRepoCount} />
              </span>
              个，
            </div>
            <div
              ref={(el) => {
                centerItemsRefs.current[1] = el;
              }}
            >
              其中，蚂蚁的开源项目
              <span
                ref={(el) => {
                  centerNumberRefs.current[1] = el;
                }}
                className={styles.number}
              >
                {data.participateAntRepoCount}
              </span>
              个
            </div>
            <div
              ref={(el) => {
                centerItemsRefs.current[2] = el;
              }}
            >
              参与了
              <span
                ref={(el) => {
                  centerNumberRefs.current[2] = el;
                }}
                className={styles.number}
              >
                <FormattedNumber value={data.participateIssueCount} />
              </span>
              条 Issue 的讨论
            </div>
            {/* 第三组 */}
            <div
              ref={(el) => {
                centerItemsRefs.current[3] = el;
              }}
            >
              变更代码
              <span
                ref={(el) => {
                  centerNumberRefs.current[3] = el;
                }}
                className={styles.number}
              >
                <FormattedNumber value={data.codeChangedLinesTotal} />
              </span>
              行
            </div>
            <div
              ref={(el) => {
                centerItemsRefs.current[4] = el;
              }}
            >
              其中，新增
              <span
                ref={(el) => {
                  centerNumberRefs.current[4] = el;
                }}
                className={styles.number}
              >
                <FormattedNumber value={data.codeChangedLinesAdded} />
              </span>
              行
            </div>
            <div
              ref={(el) => {
                centerItemsRefs.current[5] = el;
              }}
            >
              删除
              <span
                ref={(el) => {
                  centerNumberRefs.current[5] = el;
                }}
                className={styles.number}
              >
                <FormattedNumber value={data.codeChangedLinesDeleted} />
              </span>
              行
            </div>
          </div>
          {/* 底部区域 */}
          <div ref={bottomAreaRef} className={styles.bottomArea}>
            <div>
              活跃天数：
              {showActiveDaysCountUp ? (
                <CountUp
                  from={0}
                  to={data.activeDays}
                  separator=","
                  direction="up"
                  duration={1}
                  className={styles.count}
                  delay={0}
                />
              ) : (
                <span className={styles.count}>0</span>
              )}
              天
            </div>
            <div>
              贡献值：
              {showOpenRankCountUp ? (
                <CountUp
                  from={0}
                  to={data.totalOpenRank}
                  separator=","
                  direction="up"
                  duration={1}
                  className={styles.count}
                  delay={0}
                />
              ) : (
                <span className={styles.count}>0.00</span>
              )}
            </div>
          </div>
          <a
            target="_blank"
            href="https://github.com/antgroup/antoss-dev-report/tree/main/data"
            rel="noreferrer"
          >
            <div>
              <span>点击</span>
              <img src={githubLogo} alt="github" className={styles.githubLogo} />
              <span>查看数据统计规则，如有疑问请提 issue</span>
            </div>
          </a>
        </div>
      }
    />
  );
};

export default SummaryPage;
