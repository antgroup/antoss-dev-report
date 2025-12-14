import React, { useMemo, useState, useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { useSwiperSlide } from 'swiper/react';
import { useAppContext } from '@/context';
import ComputerBottomLayout from '@/layouts/ComputerBottomLayout';
import { PageId } from '@/pages/types';
import Avatar from '@/components/Avatar';
import PixelStyleContainer from '@/components/PixelStyleContainer';
import TextType from '@/components/TextType';
import CountUp from '@/components/CountUp';
import favRepoIsAntRepoBubble from './surprisingly-it-is-an-ant-open-source-project.png';
import { OSS_ENDPOINT } from '@/constants';
import { useAvatarUrl } from '@/hooks/useAvatarUrl';
import { useOrgAvatarUrl } from '@/hooks/useOrgAvatarUrl';
import { Data } from '@/types';

import styles from './index.module.scss';

interface CollaboratorData {
  login: string;
  isEmployee: boolean;
}

// 协作者头像组件
const CollaboratorAvatar: React.FC<{
  collaborator: string;
  isEmployee?: boolean;
  className?: string;
}> = ({ collaborator, isEmployee, className }) => {
  const avatarUrl = useAvatarUrl(collaborator, true);
  return (
    <Avatar
      src={avatarUrl}
      className={className}
      isAnt={isEmployee}
      href={`https://github.com/${collaborator}`}
    />
  );
};

const fetchCollaboratorData = async (login: string): Promise<CollaboratorData> => {
  try {
    const res = await fetch(`${OSS_ENDPOINT}/${login.toLowerCase()}.json`);
    if (res.status === 200) {
      const data = (await res.json()) as Data;
      return {
        login,
        isEmployee: data.isEmployee,
      };
    }
  } catch {
    // Ignore errors
  }
  return {
    login,
    isEmployee: false,
  };
};

const FavouritePage = () => {
  const { data } = useAppContext() as {
    data: NonNullable<ReturnType<typeof useAppContext>['data']>;
  };

  const { isActive } = useSwiperSlide();
  const [collaboratorsData, setCollaboratorsData] = useState<Map<string, CollaboratorData>>(
    new Map(),
  );
  const [showActiveDaysCountUp, setShowActiveDaysCountUp] = useState(false);
  const [showCollaboratorCountUp, setShowCollaboratorCountUp] = useState(false);
  const [showTextType, setShowTextType] = useState(false);

  const orgName = useMemo(() => data.favRepoName.split('/')[0], [data.favRepoName]);
  const favRepoLogo = useOrgAvatarUrl(orgName);

  // Refs for animation
  const topAreaRef = useRef<HTMLDivElement>(null);
  const favRepoIsAntRepoRef = useRef<HTMLImageElement>(null);
  const repoLinkRef = useRef<HTMLAnchorElement>(null);
  const activeDaysTextRef = useRef<HTMLDivElement>(null);
  const centerAreaRef = useRef<HTMLDivElement>(null);
  const collaboratorCountTextRef = useRef<HTMLDivElement>(null);
  const collaboratorsContainerRef = useRef<HTMLDivElement>(null);
  const collaboratorItemRefs = useRef<Array<HTMLDivElement | null>>([]);
  const aiTextRef = useRef<HTMLDivElement>(null);
  const bottomAreaRef = useRef<HTMLDivElement>(null);
  const languageItemRefs = useRef<Array<HTMLSpanElement | null>>([]);
  const languageTextRef = useRef<HTMLDivElement>(null);

  // 并发请求所有协作者的数据
  useEffect(() => {
    const fetchAllCollaborators = async () => {
      const promises = data.favCollaborators.map((login) => fetchCollaboratorData(login));
      const results = await Promise.all(promises);

      const dataMap = new Map<string, CollaboratorData>();
      results.forEach((result) => {
        dataMap.set(result.login, result);
      });
      setCollaboratorsData(dataMap);
    };

    fetchAllCollaborators();
  }, [data.favCollaborators]);

  // GSAP 动画控制
  useEffect(() => {
    if (!isActive) {
      // 重置状态
      setShowActiveDaysCountUp(false);
      setShowCollaboratorCountUp(false);
      setShowTextType(false);

      // 清理所有动画
      [
        topAreaRef.current,
        favRepoIsAntRepoRef.current,
        repoLinkRef.current,
        activeDaysTextRef.current,
        centerAreaRef.current,
        collaboratorCountTextRef.current,
        collaboratorsContainerRef.current,
        aiTextRef.current,
        bottomAreaRef.current,
        languageTextRef.current,
      ]
        .filter(Boolean)
        .forEach((el) => {
          if (el) gsap.killTweensOf(el);
        });
      collaboratorItemRefs.current.forEach((el) => {
        if (el) gsap.killTweensOf(el);
      });
      languageItemRefs.current.forEach((el) => {
        if (el) gsap.killTweensOf(el);
      });
      return;
    }

    const tl = gsap.timeline();

    // 初始化所有元素为隐藏状态
    gsap.set(topAreaRef.current, { opacity: 0 });
    if (favRepoIsAntRepoRef.current) {
      gsap.set(favRepoIsAntRepoRef.current, { opacity: 0, scale: 0.5, rotation: -15 });
    }
    gsap.set(repoLinkRef.current, { opacity: 0, x: '200%' });
    gsap.set(activeDaysTextRef.current, { opacity: 0 });
    gsap.set(centerAreaRef.current, { opacity: 0 });
    gsap.set(collaboratorCountTextRef.current, { opacity: 0 });
    gsap.set(collaboratorsContainerRef.current, { opacity: 0 });
    if (aiTextRef.current) {
      gsap.set(aiTextRef.current, { opacity: 0, y: 20 });
    }
    gsap.set(bottomAreaRef.current, { opacity: 0 });
    languageItemRefs.current.forEach((el) => {
      if (el) gsap.set(el, { opacity: 0, scale: 0 });
    });
    gsap.set(languageTextRef.current, { opacity: 0 });

    // ========== 顶部区域动画 ==========
    // TopArea 整体出现
    tl.to(topAreaRef.current, {
      opacity: 1,
      duration: 0.5,
      ease: 'power2.out',
    });

    // TextType 开始播放（"今年，你最爱的开源项目是"）
    tl.call(
      () => {
        setShowTextType(true);
      },
      [],
      '+=0.3',
    );

    // 等待 TextType 打字完成（约 2s）后再播放 repo 链接
    // Repo 链接从右边滑入，加速然后刹车
    tl.to(
      repoLinkRef.current,
      {
        opacity: 1,
        x: 0,
        duration: 0.5,
        ease: 'power3.out', // 加速然后刹车的效果
      },
      '+=1.5',
    );

    // ActiveDays 文本出现，同时 CountUp 开始
    tl.to(
      activeDaysTextRef.current,
      {
        opacity: 1,
        duration: 0.5,
        ease: 'power2.out',
      },
      '+=0.5',
    ).call(
      () => {
        setShowActiveDaysCountUp(true);
      },
      [],
      '<0.2',
    );

    // favRepoIsAntRepo 气泡在"项目里都有你活跃的身影"之后出现（如果有）
    if (favRepoIsAntRepoRef.current) {
      tl.to(
        favRepoIsAntRepoRef.current,
        {
          opacity: 1,
          scale: 1,
          rotation: 0,
          duration: 0.6,
          ease: 'back.out(1.7)',
        },
        '+=1', // 在 activeDays 文本之后
      );
    }

    // ========== 中间区域动画（停顿后开始）==========
    // CenterArea 出现
    tl.to({}, { duration: 0.5 });
    tl.to(centerAreaRef.current, {
      opacity: 1,
      duration: 0.5,
      ease: 'power2.out',
    });

    // CollaboratorCount 文本出现，同时 CountUp 开始
    tl.to(
      collaboratorCountTextRef.current,
      {
        opacity: 1,
        duration: 0.5,
        ease: 'power2.out',
      },
      '+=0.3',
    ).call(
      () => {
        setShowCollaboratorCountUp(true);
      },
      [],
      '<0.2',
    );

    // Collaborators 容器出现（等待 CountUp 完成，duration=1s，加上一些缓冲时间）
    tl.to(
      collaboratorsContainerRef.current,
      {
        opacity: 1,
        duration: 0.3,
        ease: 'power2.out',
      },
      '+=1',
    );

    // 开发者逐个出现（更夸张的效果）
    collaboratorItemRefs.current.forEach((item, index) => {
      if (item) {
        // 初始状态：缩小、旋转、透明
        gsap.set(item, {
          opacity: 0,
          scale: 0,
          rotation: -180,
          y: 50,
        });

        // 动画：放大、旋转、弹跳
        tl.to(
          item,
          {
            opacity: 1,
            scale: 1.2, // 先放大
            rotation: 0,
            y: 0,
            duration: 0.4,
            ease: 'back.out(2.5)', // 强烈的弹性效果
          },
          `+=${index * 0.15}`, // 每个间隔 0.15s
        ).to(
          item,
          {
            scale: 1, // 回弹到正常大小
            duration: 0.3,
            ease: 'power2.out',
          },
          '<0.1',
        );
      }
    });

    // AI 文案出现（在开发者动画完成后）
    if (aiTextRef.current && data.favCollaboratorIsBot.some((isBot) => !!isBot)) {
      tl.to(
        aiTextRef.current,
        {
          opacity: 1,
          y: 0,
          duration: 0.5,
          ease: 'back.out(1.7)',
        },
        '+=0.3',
      );
    }

    // ========== 底部区域动画（停顿后开始）==========
    tl.to({}, { duration: 0.5 }); // 停顿

    // BottomArea 出现
    tl.to(bottomAreaRef.current, {
      opacity: 1,
      duration: 0.5,
      ease: 'power2.out',
    });

    // 语言逐个出现
    languageItemRefs.current.forEach((item, index) => {
      if (item) {
        tl.to(
          item,
          {
            opacity: 1,
            scale: 1,
            duration: 0.3,
            ease: 'back.out(1.5)',
          },
          `+=${index * 0.1}`, // 每个间隔 0.1s
        );
      }
    });

    // 最后一行文字出现
    tl.to(
      languageTextRef.current,
      {
        opacity: 1,
        duration: 0.5,
        ease: 'power2.out',
      },
      '+=0.2',
    );

    return () => {
      tl.kill();
    };
  }, [isActive, data]);

  return (
    <ComputerBottomLayout
      name={PageId.Favourite}
      matrixRainBackgroundColor="#e8e8e8"
      paperContent={
        <div className={styles.paperContent}>
          {/* 顶部区域 */}
          <div ref={topAreaRef} className={styles.topArea}>
            {data.favRepoIsAntRepo ? (
              <img
                ref={favRepoIsAntRepoRef}
                src={favRepoIsAntRepoBubble}
                className={styles.favRepoIsAntRepo}
              />
            ) : null}
            {showTextType && (
              <div>
                <TextType
                  text="今年，你最爱的开源项目是"
                  typingSpeed={75}
                  pauseDuration={0}
                  loop={false}
                  showCursor={false}
                />
              </div>
            )}
            <a
              ref={repoLinkRef}
              href={`https://github.com/${data.favRepoName}`}
              target="_blank"
              rel="noreferrer"
              className={styles.repo}
            >
              <img className={styles.favRepoLogo} src={favRepoLogo} />
              <span className={styles.favRepoName}>{data.favRepoName}</span>
            </a>
            <div ref={activeDaysTextRef}>
              有
              {showActiveDaysCountUp ? (
                <CountUp
                  from={0}
                  to={Number(data.favRepoActiveDays)}
                  separator=""
                  direction="up"
                  duration={1}
                  className={styles.activeDays}
                  delay={0}
                />
              ) : (
                <span className={styles.activeDays}>0</span>
              )}
              天，项目里都有你活跃的身影
            </div>
          </div>
          {/* 中间区域 */}
          <div ref={centerAreaRef} className={styles.centerArea}>
            <div ref={collaboratorCountTextRef}>
              你在开源世界里邂逅了
              {showCollaboratorCountUp ? (
                <CountUp
                  from={0}
                  to={Number(data.collaboratorCount)}
                  separator=""
                  direction="up"
                  duration={1}
                  className={styles.collaboratorCount}
                  delay={0}
                />
              ) : (
                <span className={styles.collaboratorCount}>0</span>
              )}
              位开发者
            </div>
            <div ref={collaboratorsContainerRef}>
              <PixelStyleContainer className={styles.pixelStyleContainer}>
                {/* 协作开发者列表 */}
                <div className={styles.collaborators}>
                  {data.favCollaborators.map((collaborator, index) => {
                    const collaboratorData = collaboratorsData.get(collaborator);
                    return (
                      <div
                        key={collaborator}
                        ref={(el) => {
                          collaboratorItemRefs.current[index] = el;
                        }}
                        className={styles.collaboratorItem}
                      >
                        <CollaboratorAvatar
                          collaborator={collaborator}
                          className={styles.collaboratorAvatar}
                          isEmployee={collaboratorData?.isEmployee}
                        />
                        <span className={styles.collaboratorName}>{collaborator}</span>
                      </div>
                    );
                  })}
                </div>
              </PixelStyleContainer>
            </div>
            {data.favCollaboratorIsBot.some((isBot) => !!isBot) && (
              <div ref={aiTextRef}>今年你和 AI 并肩作战，打怪升级</div>
            )}
          </div>
          {/* 底部区域 */}
          <div ref={bottomAreaRef} className={styles.bottomArea}>
            <div className={styles.languageContainer}>
              {data.favLanguages.map((language, index) => (
                <div
                  key={language}
                  ref={(el) => {
                    languageItemRefs.current[index] = el;
                  }}
                  className={styles.languageItem}
                >
                  {language}
                </div>
              ))}
            </div>
            <div ref={languageTextRef}>
              {data.favLanguages.length > 1 ? '都' : ''}
              {data.favLanguages.length > 0 ? '是你擅长的语言' : ''}
            </div>
          </div>
        </div>
      }
    />
  );
};

export default FavouritePage;
