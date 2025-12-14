import { useEffect, useRef } from 'react';
import { useAppContext } from '@/context';
import { PageId } from '@/pages/types';
import BaseLayout from '@/layouts/BaseLayout';
import EnvelopeLetter from '@/components/EnvelopeLetter';
import RetroComputer from '@/components/RetroComputer';
import antOpenSourceLogo from '@/assets/ant-open-source-logo.png';
import ReportCover from '@/components/ReportCover';
import Avatar from '@/components/Avatar';
import { useAvatarUrl } from '@/hooks/useAvatarUrl';
import { useSwiperSlide } from 'swiper/react';
import gsap from 'gsap';
import AntOpenSourceDomainExample from './AntOpenSourceDomainExample';

import styles from './index.module.scss';

const ThanksPage = () => {
  const { data } = useAppContext() as {
    data: NonNullable<ReturnType<typeof useAppContext>['data']>;
  };

  const { isActive } = useSwiperSlide();
  const avatarUrl = useAvatarUrl(data.login);

  // 创建 refs 用于动画
  const userRef = useRef<HTMLDivElement>(null);
  const thanksRef = useRef<HTMLDivElement>(null);
  const thanksLine1Ref = useRef<HTMLDivElement>(null);
  const thanksLine2Ref = useRef<HTMLDivElement>(null);
  const domainExample1Ref = useRef<HTMLDivElement>(null);
  const domainExample2Ref = useRef<HTMLDivElement>(null);
  const domainExample3Ref = useRef<HTMLDivElement>(null);
  const domainExample4Ref = useRef<HTMLDivElement>(null);
  const usesAndContributesRef = useRef<HTMLDivElement>(null);
  const retroComputerRef = useRef<HTMLDivElement>(null);

  // GSAP 动画控制
  useEffect(() => {
    if (!isActive) {
      // 页面未激活时，清理动画并重置状态
      const refs = [
        userRef.current,
        thanksLine1Ref.current,
        thanksLine2Ref.current,
        domainExample1Ref.current,
        domainExample2Ref.current,
        domainExample3Ref.current,
        domainExample4Ref.current,
        usesAndContributesRef.current,
        retroComputerRef.current,
      ];
      refs.forEach((ref) => {
        if (ref) {
          gsap.killTweensOf(ref);
          gsap.set(ref, { opacity: 0 });
        }
      });
      return;
    }

    const tl = gsap.timeline();

    // 初始化所有元素为隐藏状态
    if (userRef.current) {
      gsap.set(userRef.current, { opacity: 0 });
    }
    if (thanksLine1Ref.current) {
      gsap.set(thanksLine1Ref.current, { opacity: 0, y: 20 });
    }
    if (thanksLine2Ref.current) {
      gsap.set(thanksLine2Ref.current, { opacity: 0, y: 20 });
    }
    if (domainExample1Ref.current) {
      gsap.set(domainExample1Ref.current, { opacity: 0, y: 20 });
    }
    if (domainExample2Ref.current) {
      gsap.set(domainExample2Ref.current, { opacity: 0, y: 20 });
    }
    if (domainExample3Ref.current) {
      gsap.set(domainExample3Ref.current, { opacity: 0, y: 20 });
    }
    if (domainExample4Ref.current) {
      gsap.set(domainExample4Ref.current, { opacity: 0, y: 20 });
    }
    if (usesAndContributesRef.current) {
      gsap.set(usesAndContributesRef.current, { opacity: 0 });
    }
    if (retroComputerRef.current) {
      gsap.set(retroComputerRef.current, { opacity: 0 });
    }

    // 1. 电脑最先出现
    if (retroComputerRef.current) {
      tl.to(
        retroComputerRef.current,
        {
          opacity: 1,
          y: 0,
          duration: 0.4,
          ease: 'power2.out',
        },
        '+=0.5',
      );
    }

    // 2. user 出现（间隔 0.5s）
    if (userRef.current) {
      tl.to(
        userRef.current,
        {
          opacity: 1,
          y: 0,
          duration: 0.4,
          ease: 'power2.out',
        },
        '+=0',
      );
    }

    // 4. thanks 成一组出现（间隔 0.5s）
    if (thanksLine1Ref.current && thanksLine2Ref.current) {
      tl.to(
        [thanksLine1Ref.current, thanksLine2Ref.current],
        {
          opacity: 1,
          y: 0,
          duration: 0.4,
          ease: 'power2.out',
        },
        '+=0.4',
      );
    }

    // 5. domainExamples 依次出现（每个间隔 0.5s）
    if (domainExample1Ref.current) {
      tl.to(
        domainExample1Ref.current,
        {
          opacity: 1,
          y: 0,
          duration: 0.4,
          ease: 'power2.out',
        },
        '+=0.6',
      );
    }
    if (domainExample2Ref.current) {
      tl.to(
        domainExample2Ref.current,
        {
          opacity: 1,
          y: 0,
          duration: 0.4,
          ease: 'power2.out',
        },
        '+=0.6',
      );
    }
    if (domainExample3Ref.current) {
      tl.to(
        domainExample3Ref.current,
        {
          opacity: 1,
          y: 0,
          duration: 0.4,
          ease: 'power2.out',
        },
        '+=0.6',
      );
    }
    if (domainExample4Ref.current) {
      tl.to(
        domainExample4Ref.current,
        {
          opacity: 1,
          y: 0,
          duration: 0.4,
          ease: 'power2.out',
        },
        '+=0.6',
      );
    }

    // 6. usesAndContributes 成一组出现
    if (usesAndContributesRef.current) {
      tl.to(
        usesAndContributesRef.current,
        {
          opacity: 1,
          duration: 2,
          ease: 'power2.out',
        },
        '+=0.6',
      );
    }
  }, [isActive]);

  return (
    <BaseLayout name={PageId.Thanks} matrixRainBackgroundColor="#e8e8e8" hideLogo>
      {/* logo */}
      <img className={styles.topLogo} src={antOpenSourceLogo} />
      {/* 信封和信 */}
      <EnvelopeLetter className={styles.envelopeLetter} showTopRightMedal showBackgroundMedal>
        {/* 头像和id */}
        <div ref={userRef} className={styles.user}>
          <Avatar src={avatarUrl} className={styles.avatar} isAnt={data.isEmployee} href={`https://github.com/${data.login}`} />
          <div className={styles.login}>@{data.login}</div>
        </div>
        <div ref={thanksRef} className={styles.thanks}>
          <div ref={thanksLine1Ref}>感谢你</div>
          <div ref={thanksLine2Ref}>成为蚂蚁开源的开发者</div>
        </div>
        <div className={styles.antOpenSourceDomainExamples}>
          <div ref={domainExample1Ref}>
            <AntOpenSourceDomainExample domain="从体验交互" projectNames={['Ant Design', 'AntV']} />
          </div>
          <div ref={domainExample2Ref}>
            <AntOpenSourceDomainExample
              domain="到云原生基础设施"
              projectNames={['Kata Containers', 'SOFAStack']}
            />
          </div>
          <div ref={domainExample3Ref}>
            <AntOpenSourceDomainExample
              domain="从深耕基础技术"
              projectNames={['OceanBase', 'SecretFlow']}
            />
          </div>
          <div ref={domainExample4Ref}>
            <AntOpenSourceDomainExample
              domain="到 AI 前沿探索"
              projectNames={['inclusionAI', 'agentUniverse']}
            />
          </div>
        </div>
        <div ref={usesAndContributesRef} className={styles.antOpenSourceUsesAndContributes}>
          <div>蚂蚁使用开源，也回馈开源，</div>
          <div>始终为社区带来微小而美好的改变</div>
        </div>
      </EnvelopeLetter>
      {/* 电脑 */}
      <div ref={retroComputerRef} className={styles.retroComputer}>
        <RetroComputer variant="normal">
          <ReportCover />
        </RetroComputer>
      </div>
      <img className={`${styles.bottomLogo}`} src={antOpenSourceLogo} />
    </BaseLayout>
  );
};

export default ThanksPage;
