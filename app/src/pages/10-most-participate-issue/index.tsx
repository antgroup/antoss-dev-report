import { useEffect, useRef, useState } from 'react';
import { useAppContext } from '@/context';
import ComputerTopLayout from '@/layouts/ComputerTopLayout';
import { PageId } from '@/pages/types';
import { useSwiperSlide } from 'swiper/react';
import gsap from 'gsap';
import TextType from '@/components/TextType';

import styles from './index.module.scss';
import PixelStyleBubble from './PixelStyleBubble';
import { ellipsisMiddle, getRepoEventTypeLabel, getRepoEventActionLabel } from '@/utils';
import PixelStyleContainer from '@/components/PixelStyleContainer';
import Avatar from '@/components/Avatar';
import { useAvatarUrl } from '@/hooks/useAvatarUrl';
import BubblingLoveHeart from './BubblingLoveHeart';

const MostParticipateIssuePage = () => {
  const { data } = useAppContext() as {
    data: NonNullable<ReturnType<typeof useAppContext>['data']>;
  };

  const { isActive } = useSwiperSlide();
  const [showTextType1, setShowTextType1] = useState(false);
  const [showTextType2a, setShowTextType2a] = useState(false);
  const [showTextType2b, setShowTextType2b] = useState(false);
  const [showTextType4, setShowTextType4] = useState(false);
  const [showTextType5, setShowTextType5] = useState(false);

  // 创建 refs 用于动画
  const screenTextType1Ref = useRef<HTMLDivElement>(null);
  const screenTextType2Ref = useRef<HTMLDivElement>(null);
  const screenIssueNumberRef = useRef<HTMLSpanElement>(null);
  const topAreaFirstLineRef = useRef<HTMLDivElement>(null);
  const issueBubbleRef = useRef<HTMLAnchorElement>(null);
  const lastLineRef = useRef<HTMLDivElement>(null);
  const dateTimeRef = useRef<HTMLDivElement>(null);
  const commentTypeTextRef = useRef<HTMLDivElement>(null);
  const resolvedContainerRef = useRef<HTMLDivElement>(null);
  const resolvedLine1Ref = useRef<HTMLDivElement>(null);
  const resolvedLine2Ref = useRef<HTMLDivElement>(null);
  const resolvedLine3Ref = useRef<HTMLDivElement>(null);
  const resolvedHeartRef = useRef<HTMLDivElement>(null);
  const commentContainerRef = useRef<HTMLDivElement>(null);
  const commentBodyRef = useRef<HTMLDivElement>(null);
  const bottomTextRef = useRef<HTMLDivElement>(null);
  const {
    login,
    mostParticipateIssueRepoName,
    mostParticipateIssueNumber,
    mostParticipateIssueTitle,
    mostParticipateIssueType,
    mostParticipateIssueAction,
    mostParticipateIssueDateTime,
    mostParticipateIssueDuration,
    mostParticipateIssueDevelopers,
    mostParticipateIssueBody,
  } = data;

  const mostParticipateIssueDate = new Date(mostParticipateIssueDateTime);

  // 判断是否是评论类型
  const isCommentType =
    mostParticipateIssueType === 'IssueCommentEvent' && mostParticipateIssueAction === 'created';

  // 计算参与讨论的人数（不包括自己）
  let participantCount = 0;
  if (Array.isArray(mostParticipateIssueDevelopers)) {
    participantCount = mostParticipateIssueDevelopers.length;
  } else if (typeof mostParticipateIssueDevelopers === 'number') {
    participantCount = mostParticipateIssueDevelopers;
  }

  // 获取动作和类型标签
  const actionLabel = getRepoEventActionLabel(mostParticipateIssueType, mostParticipateIssueAction);
  const typeLabel = getRepoEventTypeLabel(mostParticipateIssueType);

  const avatarUrl = useAvatarUrl(login);

  // 构建日期时间文本
  const dateTimeText = `${mostParticipateIssueDate.getFullYear()} 年 ${mostParticipateIssueDate.getMonth() + 1} 月 ${mostParticipateIssueDate.getDate()} 日 ${mostParticipateIssueDate.getHours()} 点`;

  // GSAP 动画控制
  useEffect(() => {
    if (!isActive) {
      // 重置状态
      setShowTextType1(false);
      setShowTextType2a(false);
      setShowTextType2b(false);
      setShowTextType4(false);
      setShowTextType5(false);

      // 清理所有动画
      const refs = [
        screenTextType1Ref.current,
        screenTextType2Ref.current,
        screenIssueNumberRef.current,
        topAreaFirstLineRef.current,
        issueBubbleRef.current,
        lastLineRef.current,
        dateTimeRef.current,
        commentTypeTextRef.current,
        resolvedContainerRef.current,
        resolvedLine1Ref.current,
        resolvedLine2Ref.current,
        resolvedLine3Ref.current,
        resolvedHeartRef.current,
        commentContainerRef.current,
        commentBodyRef.current,
        bottomTextRef.current,
      ];
      refs.forEach((ref) => {
        if (ref) gsap.killTweensOf(ref);
      });

      // 重置状态
      if (screenTextType1Ref.current) {
        gsap.set(screenTextType1Ref.current, { opacity: 0 });
      }
      if (screenTextType2Ref.current) {
        gsap.set(screenTextType2Ref.current, { opacity: 0 });
      }
      if (screenIssueNumberRef.current) {
        gsap.set(screenIssueNumberRef.current, { opacity: 0 });
      }
      if (topAreaFirstLineRef.current) {
        gsap.set(topAreaFirstLineRef.current, { opacity: 0, y: 20 });
      }
      if (issueBubbleRef.current) {
        gsap.set(issueBubbleRef.current, { opacity: 0, scale: 0 });
      }
      if (lastLineRef.current) {
        gsap.set(lastLineRef.current, { opacity: 0, y: 20 });
      }
      if (dateTimeRef.current) {
        gsap.set(dateTimeRef.current, { opacity: 0 });
      }
      if (commentContainerRef.current) {
        gsap.set(commentContainerRef.current, { opacity: 0, x: '100%' });
      }
      if (commentTypeTextRef.current) {
        gsap.set(commentTypeTextRef.current, { opacity: 0, y: 20 });
      }
      if (resolvedContainerRef.current) {
        gsap.set(resolvedContainerRef.current, { opacity: 0 });
      }
      if (resolvedLine1Ref.current) {
        gsap.set(resolvedLine1Ref.current, { opacity: 0, y: 20 });
      }
      if (resolvedLine2Ref.current) {
        gsap.set(resolvedLine2Ref.current, { opacity: 0, y: 20 });
      }
      if (resolvedLine3Ref.current) {
        gsap.set(resolvedLine3Ref.current, { opacity: 0, y: 20 });
      }
      if (resolvedHeartRef.current) {
        gsap.set(resolvedHeartRef.current, { opacity: 0 });
      }
      if (commentBodyRef.current) {
        gsap.set(commentBodyRef.current, { opacity: 0 });
      }
      if (bottomTextRef.current) {
        gsap.set(bottomTextRef.current, { opacity: 0 });
      }
      return;
    }

    const tl = gsap.timeline();

    // 初始化状态
    if (screenTextType1Ref.current) {
      gsap.set(screenTextType1Ref.current, { opacity: 0 });
    }
    if (screenTextType2Ref.current) {
      gsap.set(screenTextType2Ref.current, { opacity: 0 });
    }
    if (screenIssueNumberRef.current) {
      gsap.set(screenIssueNumberRef.current, { opacity: 0 });
    }
    if (topAreaFirstLineRef.current) {
      gsap.set(topAreaFirstLineRef.current, { opacity: 0, y: 20 });
    }
    if (issueBubbleRef.current) {
      gsap.set(issueBubbleRef.current, { opacity: 0, scale: 0 });
    }
    if (lastLineRef.current) {
      gsap.set(lastLineRef.current, { opacity: 0, y: 20 });
    }
    if (dateTimeRef.current) {
      gsap.set(dateTimeRef.current, { opacity: 0 });
    }
    if (commentContainerRef.current) {
      gsap.set(commentContainerRef.current, { opacity: 0, x: '100%' });
    }
    if (commentTypeTextRef.current) {
      gsap.set(commentTypeTextRef.current, { opacity: 0, y: 20 });
    }
    if (resolvedContainerRef.current) {
      gsap.set(resolvedContainerRef.current, { opacity: 0 });
    }
    if (resolvedLine1Ref.current) {
      gsap.set(resolvedLine1Ref.current, { opacity: 0, y: 20 });
    }
    if (resolvedLine2Ref.current) {
      gsap.set(resolvedLine2Ref.current, { opacity: 0, y: 20 });
    }
    if (resolvedLine3Ref.current) {
      gsap.set(resolvedLine3Ref.current, { opacity: 0, y: 20 });
    }
    if (resolvedHeartRef.current) {
      gsap.set(resolvedHeartRef.current, { opacity: 0 });
    }
    if (commentBodyRef.current) {
      gsap.set(commentBodyRef.current, { opacity: 0 });
    }
    if (bottomTextRef.current) {
      gsap.set(bottomTextRef.current, { opacity: 0, y: 20 });
    }

    // 1. Screen 中的 TextType
    if (screenTextType1Ref.current) {
      tl.to(
        screenTextType1Ref.current,
        {
          opacity: 1,
          duration: 0.3,
          ease: 'power2.out',
        },
        '+=0',
      ).call(
        () => {
          setShowTextType1(true);
        },
        [],
        '<',
      );
    }

    // 等待第一个 TextType 完成后显示第二个（类型标签）
    if (screenTextType2Ref.current) {
      tl.to(
        screenTextType2Ref.current,
        {
          opacity: 1,
          duration: 0.3,
          ease: 'power2.out',
        },
        '+=0.5',
      ).call(
        () => {
          setShowTextType2a(true);
        },
        [],
        '<',
      );
    }

    // 等待类型标签完成后显示 issueNumber
    // 类型标签大约需要 1.5s（假设平均 5 个字 * 150ms + 一些延迟）
    if (screenIssueNumberRef.current) {
      tl.to(
        screenIssueNumberRef.current,
        {
          opacity: 1,
          duration: 0.3,
          ease: 'power2.out',
        },
        '+=0.5',
      ).call(
        () => {
          setShowTextType2b(true);
        },
        [],
        '<',
      );
    }

    // 2. Paper 内容开始显示（依次从上到下）
    // 第一行文字
    if (topAreaFirstLineRef.current) {
      tl.to(
        topAreaFirstLineRef.current,
        {
          opacity: 1,
          y: 0,
          duration: 0.4,
          ease: 'power2.out',
        },
        '+=1.5',
      );
    }

    // 3. 气泡弹性放大缩小（移除文字打字效果）
    if (issueBubbleRef.current) {
      tl.to(
        issueBubbleRef.current,
        {
          opacity: 1,
          scale: 1.3,
          duration: 0.4,
          ease: 'power2.out',
        },
        '+=0.6',
      ).to(
        issueBubbleRef.current,
        {
          scale: 1,
          duration: 0.4,
          ease: 'back.out(1.7)',
        },
        '<',
      );
    }

    // 最后一行
    if (lastLineRef.current) {
      tl.to(
        lastLineRef.current,
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          ease: 'power2.out',
        },
        '+=0.6',
      );
    }

    // 4. 日期时间 TextType
    if (dateTimeRef.current) {
      tl.to(
        dateTimeRef.current,
        {
          opacity: 1,
          duration: 1,
          ease: 'power2.out',
        },
        '+=0.3',
      ).call(
        () => {
          setShowTextType4(true);
        },
        [],
        '<',
      );
    }

    // 其他内容动画（依次从上到下）
    if (isCommentType) {
      // 评论类型：显示参与讨论文本
      if (commentTypeTextRef.current) {
        tl.to(
          commentTypeTextRef.current,
          {
            opacity: 1,
            y: 0,
            duration: 0.4,
            ease: 'power2.out',
          },
          '+=0.3',
        );
      }
    } else {
      // 非评论类型：显示解决相关信息
      if (resolvedContainerRef.current) {
        tl.to(
          resolvedContainerRef.current,
          {
            opacity: 1,
            duration: 0.4,
            ease: 'power2.out',
          },
          '+=0.3',
        );
      }
      if (resolvedLine1Ref.current) {
        tl.to(
          resolvedLine1Ref.current,
          {
            opacity: 1,
            y: 0,
            duration: 0.4,
            ease: 'power2.out',
          },
          '+=1.0',
        );
      }
      if (resolvedLine2Ref.current) {
        tl.to(
          resolvedLine2Ref.current,
          {
            opacity: 1,
            y: 0,
            duration: 0.4,
            ease: 'power2.out',
          },
          '+=1.0',
        );
      }
      if (resolvedLine3Ref.current) {
        tl.to(
          resolvedLine3Ref.current,
          {
            opacity: 1,
            y: 0,
            duration: 0.4,
            ease: 'power2.out',
          },
          '+=1.0',
        );
      }
      if (resolvedHeartRef.current) {
        tl.to(
          resolvedHeartRef.current,
          {
            opacity: 1,
            duration: 0.4,
            ease: 'power2.out',
          },
          '+=1.0',
        );
      }
    }

    // 5. 评论容器从右到左闪现刹车效果
    if (commentContainerRef.current && isCommentType) {
      tl.to(
        commentContainerRef.current,
        {
          opacity: 1,
          x: '-10%',
          duration: 0.3,
          ease: 'power2.out',
        },
        '+=1',
      )
        .to(
          commentContainerRef.current,
          {
            x: '0',
            duration: 0.4,
            ease: 'back.out(1.7)',
          },
          '<',
        )
        .call(
          () => {
            // 评论内容开始打字
            setShowTextType5(true);
            if (commentBodyRef.current) {
              gsap.to(commentBodyRef.current, {
                opacity: 1,
                duration: 0,
                ease: 'power2.out',
              });
            }
          },
          [],
          '+=0.5',
        );
    }
    // 底部文本
    if (bottomTextRef.current) {
      tl.to(
        bottomTextRef.current,
        {
          opacity: 1,
          duration: 2,
          ease: 'power2.out',
        },
        '+=2',
      );
    }
  }, [isActive, isCommentType, dateTimeText, actionLabel, typeLabel]);

  return (
    <ComputerTopLayout
      name={PageId.MostParticipateIssue}
      screenContent={
        <div className={styles.screenContent}>
          <div ref={screenTextType1Ref} style={{ opacity: 0 }}>
            {showTextType1 && (
              <TextType
                text="与开发者们共聚"
                typingSpeed={70}
                className={styles.textTypeLine}
                showCursor={false}
                loop={false}
              />
            )}
          </div>
          <div ref={screenTextType2Ref} style={{ opacity: 0 }}>
            {showTextType2a && (
              <TextType
                text={getRepoEventTypeLabel(mostParticipateIssueType)}
                typingSpeed={75}
                className={styles.textTypeInline}
                showCursor={false}
                loop={false}
              />
            )}
            <span
              ref={screenIssueNumberRef}
              className={`${styles.issueNumber} ${mostParticipateIssueNumber > 10000 ? styles.longIssueNumber : ''}`}
              style={{ opacity: 0 }}
            >
              {showTextType2b && (
                <TextType
                  text={`#${mostParticipateIssueNumber}`}
                  typingSpeed={75}
                  className={styles.textTypeInline}
                  showCursor={false}
                  loop={false}
                />
              )}
            </span>
          </div>
        </div>
      }
      paperContent={
        <div className={styles.paperContent}>
          {/* 顶部区域 */}
          <div className={styles.topArea}>
            <div ref={topAreaFirstLineRef} style={{ opacity: 0 }}>
              你应该对 <span className={styles.repo}>{mostParticipateIssueRepoName}</span> 项目中的
            </div>
            <a
              ref={issueBubbleRef}
              href={`https://github.com/${mostParticipateIssueRepoName}/issues/${mostParticipateIssueNumber}`}
              target="_blank"
              rel="noreferrer"
              className={styles.issue}
              style={{ opacity: 0, transform: 'scale(0)' }}
            >
              <PixelStyleBubble>
                <span className={styles.number}>#{mostParticipateIssueNumber}&nbsp;</span>
                <span className={styles.issueTitle}>
                  {ellipsisMiddle(mostParticipateIssueTitle, 50)}
                </span>
              </PixelStyleBubble>
            </a>
            <div ref={lastLineRef} className={styles.lastLine} style={{ opacity: 0 }}>
              印象深刻
            </div>
          </div>
          <div>
            <div ref={dateTimeRef} style={{ opacity: 0 }}>
              {showTextType4 ? (
                <TextType text={dateTimeText} typingSpeed={35} showCursor={false} loop={false} />
              ) : (
                <span>{dateTimeText}</span>
              )}
            </div>
            {isCommentType ? (
              <div ref={commentTypeTextRef} style={{ opacity: 0 }}>
                你和<span className={styles.number}>{participantCount}</span>
                位开发者一起，参与了讨论
              </div>
            ) : (
              <div ref={resolvedContainerRef} className={styles.resolved} style={{ opacity: 0 }}>
                <div className={styles.resolvedLeft}>
                  <div ref={resolvedLine1Ref} style={{ opacity: 0 }}>
                    你{actionLabel}了这条 {typeLabel}
                  </div>
                  <div ref={resolvedLine2Ref} style={{ opacity: 0 }}>
                    还有
                    <span className={styles.number}>{participantCount}</span>
                    位开发者也参与其中
                  </div>
                  <div ref={resolvedLine3Ref} style={{ opacity: 0 }}>
                    耗时<span className={styles.number}>{mostParticipateIssueDuration}</span>
                    天，它成功地被解决
                  </div>
                </div>
                <div className={styles.resolvedRight}>
                  <div ref={resolvedHeartRef} style={{ opacity: 0 }}>
                    <BubblingLoveHeart />
                  </div>
                </div>
              </div>
            )}
          </div>
          {isCommentType && (
            <div ref={commentContainerRef} style={{ opacity: 0, transform: 'translateX(100%)' }}>
              <PixelStyleContainer>
                <div className={styles.comment}>
                  {/* 左边头像 */}
                  <div className={styles.commentLeft}>
                    <Avatar
                      src={avatarUrl}
                      className={styles.avatar}
                      href={`https://github.com/${login}`}
                    />
                    <div className={styles.login}>@{login}</div>
                  </div>
                  {/* 右边评论内容 */}
                  <div ref={commentBodyRef} className={styles.commentRight} style={{ opacity: 0 }}>
                    {showTextType5 ? (
                      <TextType
                        text={`「${ellipsisMiddle(mostParticipateIssueBody, 60)}」`}
                        typingSpeed={30}
                        showCursor={false}
                        loop={false}
                      />
                    ) : (
                      ''
                    )}
                  </div>
                </div>
              </PixelStyleContainer>
            </div>
          )}
          <div ref={bottomTextRef} style={{ opacity: 0 }}>
            是否还记得和志同道合的人共同探讨、协作和解决问题的快乐？
          </div>
        </div>
      }
    />
  );
};

export default MostParticipateIssuePage;
