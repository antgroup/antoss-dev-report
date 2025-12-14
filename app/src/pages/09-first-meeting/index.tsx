import { ReactNode, useEffect, useRef, useState } from 'react';
import { useSwiperSlide } from 'swiper/react';
import gsap from 'gsap';

import { useAppContext } from '@/context';
import ComputerTopLayout from '@/layouts/ComputerTopLayout';
import { PageId } from '@/pages/types';
import FormattedNumber from '@/components/FormattedNumber';
import TextType from '@/components/TextType';
import { getRepoEventActionLabel, getRepoEventTypeLabel, getReactionEmoji } from '@/utils';
import SnowScreen from '@/components/SnowScreen';

import styles from './index.module.scss';

/**
 * 获取仓库事件的完整描述文本（用于展示在页面中）
 * @param repoName 仓库名称
 * @param eventType 事件类型（如 IssuesEvent, PullRequestEvent 等）
 * @param eventAction 事件动作（如 opened, closed, created 等）
 * @returns 包含仓库名称和事件描述的完整 ReactNode，对于 Star 和 Fork 事件使用特殊语序
 */
const getRepoEventFullDescription = (
  repoName: string,
  eventType: string,
  eventAction: string,
): ReactNode => {
  // Star 和 Fork 事件使用特殊语序："你Star了xxx/xxx仓库" 或 "你Fork了xxx/xxx仓库"
  if (eventType === 'WatchEvent') {
    return (
      <>
        你 Star 了 <span className={styles.repo}>{repoName}</span>
      </>
    );
  }
  if (eventType === 'ForkEvent') {
    return (
      <>
        你 Fork 了 <span className={styles.repo}>{repoName}</span>
      </>
    );
  }

  // IssuesReactionEvent 使用特殊语序："你在xxx中表情回复了[emoji]"
  if (eventType === 'IssuesReactionEvent') {
    const emoji = getReactionEmoji(eventAction);
    return (
      <>
        你在 <span className={styles.repo}>{repoName}</span> 中表情回复了{emoji ? ` ${emoji}` : ''}
      </>
    );
  }

  // 其他事件使用正常语序："你在xx/xx仓库中创建了PR"
  const actionLabel = getRepoEventActionLabel(eventType, eventAction);
  const typeLabel = getRepoEventTypeLabel(eventType);
  return (
    <>
      你在 <span className={styles.repo}>{repoName}</span> 中{actionLabel}了 {typeLabel}
    </>
  );
};

const FirstMeetingPage = () => {
  const { data } = useAppContext() as {
    data: NonNullable<ReturnType<typeof useAppContext>['data']>;
  };

  const { isActive } = useSwiperSlide();
  const contentRef = useRef<HTMLDivElement>(null);
  const [isContentOverflowing, setIsContentOverflowing] = useState(false);
  const [showTextType1, setShowTextType1] = useState(false);
  const [showTextType2a, setShowTextType2a] = useState(false);
  const [showTextType2b, setShowTextType2b] = useState(false);
  const [showTextType2c, setShowTextType2c] = useState(false);

  // 创建 refs 用于动画
  const snowScreenRef = useRef<HTMLDivElement>(null);
  const textTypeContainerRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLDivElement>(null);
  const paperContentRef = useRef<HTMLDivElement>(null);
  const group1Ref = useRef<HTMLDivElement>(null);
  const group2Ref = useRef<HTMLDivElement>(null);
  const group3Ref = useRef<HTMLDivElement>(null);
  const group4Ref = useRef<HTMLDivElement>(null);
  const titleOverlayRef = useRef<HTMLDivElement>(null);
  const overlay1Ref = useRef<HTMLDivElement>(null);
  const overlay2Ref = useRef<HTMLDivElement>(null);
  const overlay3Ref = useRef<HTMLDivElement>(null);
  const overlay4Ref = useRef<HTMLDivElement>(null);
  const firstMeetingDate = new Date(data.firstAntRepoDateTime);
  const eventDescription = getRepoEventFullDescription(
    data.firstAntRepoName,
    data.firstAntRepoType,
    data.firstAntRepoAction,
  );
  const daysSinceFirstMeeting = Math.floor(
    (new Date().getTime() - firstMeetingDate.getTime()) / (1000 * 60 * 60 * 24),
  );
  const monthsSinceFirstMeeting = Math.ceil(daysSinceFirstMeeting / 30);
  const yearsSinceFirstMeeting = Math.ceil(daysSinceFirstMeeting / 365);

  // 检测 content 是否溢出
  useEffect(() => {
    const checkOverflow = () => {
      if (contentRef.current) {
        const isOverflowing = contentRef.current.scrollHeight > contentRef.current.clientHeight;
        setIsContentOverflowing(isOverflowing);
      }
    };

    checkOverflow();
    // 监听窗口大小变化和内容变化
    window.addEventListener('resize', checkOverflow);
    // 使用 MutationObserver 监听内容变化
    const observer = new MutationObserver(checkOverflow);
    if (contentRef.current) {
      observer.observe(contentRef.current, {
        childList: true,
        subtree: true,
        attributes: true,
        attributeFilter: ['style', 'class'],
      });
    }

    return () => {
      window.removeEventListener('resize', checkOverflow);
      observer.disconnect();
    };
  }, []);

  // GSAP 动画控制
  useEffect(() => {
    if (!isActive) {
      // 重置状态
      setShowTextType1(false);
      setShowTextType2a(false);
      setShowTextType2b(false);
      setShowTextType2c(false);

      // 清理所有动画
      const refs = [
        snowScreenRef.current,
        textTypeContainerRef.current,
        titleRef.current,
        paperContentRef.current,
        group1Ref.current,
        group2Ref.current,
        group3Ref.current,
        group4Ref.current,
        titleOverlayRef.current,
        overlay1Ref.current,
        overlay2Ref.current,
        overlay3Ref.current,
        overlay4Ref.current,
      ];
      refs.forEach((ref) => {
        if (ref) gsap.killTweensOf(ref);
      });

      // 重置状态
      if (snowScreenRef.current) {
        gsap.set(snowScreenRef.current, { opacity: 1 });
      }
      if (textTypeContainerRef.current) {
        gsap.set(textTypeContainerRef.current, { opacity: 0 });
      }
      // paper 内容一开始就显示，但带蒙层
      if (titleRef.current) {
        gsap.set(titleRef.current, { opacity: 1 });
      }
      if (paperContentRef.current) {
        gsap.set(paperContentRef.current, { opacity: 1 });
      }
      if (group1Ref.current) {
        gsap.set(group1Ref.current, { opacity: 1 });
      }
      if (group2Ref.current) {
        gsap.set(group2Ref.current, { opacity: 1 });
      }
      if (group3Ref.current) {
        gsap.set(group3Ref.current, { opacity: 1 });
      }
      if (group4Ref.current) {
        gsap.set(group4Ref.current, { opacity: 1 });
      }
      if (titleOverlayRef.current) {
        gsap.set(titleOverlayRef.current, { opacity: 1 });
      }
      if (overlay1Ref.current) {
        gsap.set(overlay1Ref.current, { opacity: 1 });
      }
      if (overlay2Ref.current) {
        gsap.set(overlay2Ref.current, { opacity: 1 });
      }
      if (overlay3Ref.current) {
        gsap.set(overlay3Ref.current, { opacity: 1 });
      }
      if (overlay4Ref.current) {
        gsap.set(overlay4Ref.current, { opacity: 1 });
      }
      return;
    }

    const tl = gsap.timeline();

    // 初始化状态
    if (snowScreenRef.current) {
      gsap.set(snowScreenRef.current, { opacity: 1 });
    }
    if (textTypeContainerRef.current) {
      gsap.set(textTypeContainerRef.current, { opacity: 0 });
    }
    // paper 内容一开始就显示，但带蒙层
    if (titleRef.current) {
      gsap.set(titleRef.current, { opacity: 1 });
    }
    if (paperContentRef.current) {
      gsap.set(paperContentRef.current, { opacity: 1 });
    }
    if (group1Ref.current) {
      gsap.set(group1Ref.current, { opacity: 1 });
    }
    if (group2Ref.current) {
      gsap.set(group2Ref.current, { opacity: 1 });
    }
    if (group3Ref.current) {
      gsap.set(group3Ref.current, { opacity: 1 });
    }
    if (group4Ref.current) {
      gsap.set(group4Ref.current, { opacity: 1 });
    }
    if (titleOverlayRef.current) {
      gsap.set(titleOverlayRef.current, { opacity: 1 });
    }
    if (overlay1Ref.current) {
      gsap.set(overlay1Ref.current, { opacity: 1 });
    }
    if (overlay2Ref.current) {
      gsap.set(overlay2Ref.current, { opacity: 1 });
    }
    if (overlay3Ref.current) {
      gsap.set(overlay3Ref.current, { opacity: 1 });
    }
    if (overlay4Ref.current) {
      gsap.set(overlay4Ref.current, { opacity: 1 });
    }

    // 1. SnowScreen 播放 2s
    // 2. SnowScreen 渐隐
    if (snowScreenRef.current) {
      tl.to(
        snowScreenRef.current,
        {
          opacity: 0,
          duration: 0.5,
          ease: 'power2.out',
        },
        '+=2',
      );
    }

    // 3. TextType 显示（SnowScreen 隐藏后显示 TextType）
    if (textTypeContainerRef.current) {
      tl.to(
        textTypeContainerRef.current,
        {
          opacity: 1,
          duration: 0.3,
          ease: 'power2.out',
        },
        '-=0.2',
      ).call(
        () => {
          setShowTextType1(true);
        },
        [],
        '<',
      );
    }

    // 等待第一个 TextType 完成后显示第二个
    // 第一个 TextType 大约需要 2.35s（"你和蚂蚁开源的故事" 约 9 个字 * 150ms + 1000ms pause）
    if (textTypeContainerRef.current) {
      tl.call(
        () => {
          setShowTextType2a(true);
        },
        [],
        '+=2.35',
      );
    }

    // 等待"在"字显示完成后显示年份
    // "在"字大约需要 150ms
    if (textTypeContainerRef.current) {
      tl.call(
        () => {
          setShowTextType2b(true);
        },
        [],
        '+=0.15',
      );
    }

    // 等待年份显示完成后显示"年开启"
    // 年份（如2017）大约需要 0.6s，4个数字 * 150ms
    if (textTypeContainerRef.current) {
      tl.call(
        () => {
          setShowTextType2c(true);
        },
        [],
        '+=0.6',
      );
    }

    // 等待 TextType 完成（"年开启" 大约需要 0.45s，3个字 * 150ms）
    // 4. 激活第一次相遇日期（第一个激活的）
    if (titleOverlayRef.current) {
      tl.to(
        titleOverlayRef.current,
        {
          opacity: 0,
          duration: 0.3,
          ease: 'power2.out',
        },
        '+=1.5',
      );
    }

    // 5. 逐个激活四组内容
    // 激活第一组
    if (overlay1Ref.current) {
      tl.to(
        overlay1Ref.current,
        {
          opacity: 0,
          duration: 0.3,
          ease: 'power2.out',
        },
        '+=1.5',
      );
    }

    // 激活第二组
    if (overlay2Ref.current) {
      tl.to(
        overlay2Ref.current,
        {
          opacity: 0,
          duration: 0.3,
          ease: 'power2.out',
        },
        '+=1.5',
      ).call(
        () => {
          // 第二组激活
        },
        [],
        '<',
      );
    }

    // 激活第三组
    if (overlay3Ref.current) {
      tl.to(
        overlay3Ref.current,
        {
          opacity: 0,
          duration: 0.3,
          ease: 'power2.out',
        },
        '+=1.5',
      ).call(
        () => {
          // 第三组激活
        },
        [],
        '<',
      );
    }

    // 激活第四组
    if (overlay4Ref.current) {
      tl.to(
        overlay4Ref.current,
        {
          opacity: 0,
          duration: 0.3,
          ease: 'power2.out',
        },
        '+=1.5',
      ).call(
        () => {
          // 第四组激活
        },
        [],
        '<',
      );
    }

    // 7. 去掉所有蒙层（最后一组激活后）
    if (overlay1Ref.current && overlay2Ref.current && overlay3Ref.current && overlay4Ref.current) {
      tl.to(
        [overlay1Ref.current, overlay2Ref.current, overlay3Ref.current, overlay4Ref.current],
        {
          opacity: 0,
          duration: 0.3,
          ease: 'power2.out',
        },
        '+=0.5',
      );
    }
  }, [isActive]);

  // 根据时间长度选择不同的文案
  const renderTimeDescription = () => {
    if (daysSinceFirstMeeting < 30) {
      // 少于1个月，显示天数
      return (
        <>
          从相遇的第一天起，你已与蚂蚁开源相识
          <span className={styles.number}>
            <FormattedNumber value={daysSinceFirstMeeting} />
          </span>
          天。
        </>
      );
    } else if (daysSinceFirstMeeting < 365) {
      // 少于1年，用月来计数
      return (
        <>
          从相遇的第一天起，你已与蚂蚁开源相识
          <span className={styles.number}>
            <FormattedNumber value={daysSinceFirstMeeting} />
          </span>
          天，感谢你近
          <span className={styles.number}>
            <FormattedNumber value={monthsSinceFirstMeeting} />
          </span>
          个月来的陪伴！
        </>
      );
    } else {
      // 大于等于1年，用年来计数
      return (
        <>
          从相遇的第一天起，你已与蚂蚁开源相识
          <span className={styles.number}>
            <FormattedNumber value={daysSinceFirstMeeting} />
          </span>
          天，感谢你近
          <span className={styles.number}>
            <FormattedNumber value={yearsSinceFirstMeeting} />
          </span>
          年来的陪伴！
        </>
      );
    }
  };

  return (
    <ComputerTopLayout
      name={PageId.FirstMeeting}
      screenContent={
        <div className={styles.screenContent}>
          <div ref={snowScreenRef} className={styles.snowScreen}>
            <SnowScreen />
          </div>
          <div
            ref={textTypeContainerRef}
            className={styles.textTypeContainer}
            style={{ opacity: 0, position: 'absolute' }}
          >
            {showTextType1 && (
              <TextType
                text="你和蚂蚁开源的故事"
                typingSpeed={150}
                pauseDuration={1000}
                className={styles.textTypeLine}
                showCursor={false}
                loop={false}
              />
            )}
            {showTextType2a && (
              <div className={styles.textTypeLine}>
                <TextType
                  text="在"
                  typingSpeed={150}
                  className={styles.textTypeInline}
                  showCursor={false}
                  loop={false}
                />
                {showTextType2b && (
                  <TextType
                    text={String(firstMeetingDate.getFullYear())}
                    typingSpeed={150}
                    className={styles.year}
                    showCursor={false}
                    loop={false}
                  />
                )}
                {showTextType2c && (
                  <TextType
                    text="年开启"
                    typingSpeed={150}
                    className={styles.textTypeInline}
                    showCursor={false}
                    loop={false}
                  />
                )}
              </div>
            )}
          </div>
        </div>
      }
      paperContent={
        <div ref={paperContentRef} className={styles.paperContent} style={{ opacity: 1 }}>
          {/* 第一次相遇日期 */}
          <div ref={titleRef} className={styles.title} style={{ opacity: 1, position: 'relative' }}>
            <span className={styles.titleNumber}>{firstMeetingDate.getFullYear()}</span>年
            <span className={styles.titleNumber}>{firstMeetingDate.getMonth() + 1}</span>月
            <span className={styles.titleNumber}>{firstMeetingDate.getDate()}</span>日
            <div ref={titleOverlayRef} className={styles.overlay} style={{ opacity: 1 }} />
          </div>
          <div ref={contentRef} className={styles.content}>
            <div
              className={`${styles.firstThreeGroups} ${isContentOverflowing ? 'swiper-no-swiping' : ''}`}
            >
              {/* 第一个蚂蚁开源项目 */}
              <div
                ref={group1Ref}
                className={styles.group}
                style={{ opacity: 1, position: 'relative' }}
              >
                {eventDescription}
                <span>，这是你参与的第一个蚂蚁开源项目。</span>
                <div ref={overlay1Ref} className={styles.overlay} style={{ opacity: 1 }} />
              </div>
              {/* 已经相识 N 天 */}
              <div
                ref={group2Ref}
                className={`${styles.withBackground} ${styles.group}`}
                style={{ opacity: 1, position: 'relative' }}
              >
                <div>{renderTimeDescription()}</div>
                <div ref={overlay2Ref} className={styles.overlay} style={{ opacity: 1 }} />
              </div>
              {/* 这段时间里又参与到哪些其他蚂蚁开源项目 */}
              {data.otherAntRepos.length <= 1 ? (
                <div
                  ref={group3Ref}
                  className={styles.group}
                  style={{ opacity: 1, position: 'relative' }}
                >
                  这段时间里，你对 <span className={styles.repo}>{data.firstAntRepoName}</span>{' '}
                  的爱矢志不移。
                  <div ref={overlay3Ref} className={styles.overlay} style={{ opacity: 1 }} />
                </div>
              ) : (
                <div
                  ref={group3Ref}
                  className={styles.group}
                  style={{ opacity: 1, position: 'relative' }}
                >
                  这段时间里，你又陆续参与到&nbsp;
                  {data.otherAntRepos.map((repo: string, idx: number) => (
                    <span key={repo} className={styles.repo}>
                      {repo}
                      {idx < data.otherAntRepos.length - 1 ? '、' : ''}
                    </span>
                  ))}
                  &nbsp;项目中。
                  <div ref={overlay3Ref} className={styles.overlay} style={{ opacity: 1 }} />
                </div>
              )}
            </div>
            {/* 今年在蚂蚁的 xx 个仓库中，全球 xx 位开发者一起变更了 xx 行代码，这其中也有你的参与 */}
            <div
              ref={group4Ref}
              className={`${styles.withBackground} ${styles.group}`}
              style={{ opacity: 0, position: 'relative' }}
            >
              今年，在蚂蚁的
              <span className={styles.number}>
                <FormattedNumber value={2700} />
                {/* <FormattedNumber value={data.totalAntRepoCount} /> */}
              </span>
              多个仓库中，全球
              <span className={styles.number}>
                <FormattedNumber value={data.totalAntDeveloperCount} />
              </span>
              多位开发者一起变更了
              <span className={styles.number}>
                <FormattedNumber value={data.totalAntCodeChangedLines} />
              </span>
              行代码，感谢你们的参与！
              <div ref={overlay4Ref} className={styles.overlay} style={{ opacity: 1 }} />
            </div>
          </div>
        </div>
      }
    />
  );
};

export default FirstMeetingPage;
