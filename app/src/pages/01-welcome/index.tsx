import { useEffect, useRef, useState } from 'react';
import { useSwiper, useSwiperSlide } from 'swiper/react';
import gsap from 'gsap';
import TextType from '@/components/TextType';

import { SWIPER_DELAY } from '@/constants';
import BaseLayout from '@/layouts/BaseLayout';
import { PageId } from '@/pages/types';
import { useAppContext } from '@/context';
import AddressBar from '@/components/AddressBar';
import RetroComputer from '@/components/RetroComputer';
import ReportCover from '@/components/ReportCover';
import PressableButton, { PressableButtonRef } from '@/components/PressableButton';
import antOpenSourceIcon from '@/assets/ant-open-source-icon.png';
import paperPlane from './paper-plane.svg';

import styles from './index.module.scss';

const WelcomePage = () => {
  const { userId, setUserId } = useAppContext();
  const swiper = useSwiper();
  const { isActive } = useSwiperSlide();
  const inputRef = useRef<HTMLInputElement>(null);
  const buttonRef = useRef<PressableButtonRef>(null);

  const [showTextType1a, setShowTextType1a] = useState(false);
  const [showTextType1b, setShowTextType1b] = useState(false);
  const [showTextType2a, setShowTextType2a] = useState(false);
  const [showTextType2b, setShowTextType2b] = useState(false);
  const [showTextType2c, setShowTextType2c] = useState(false);
  const [showTextType3, setShowTextType3] = useState(false);

  // 创建 refs 用于动画
  const line1ContainerRef = useRef<HTMLDivElement>(null);
  const line2ContainerRef = useRef<HTMLDivElement>(null);
  const line3ContainerRef = useRef<HTMLDivElement>(null);
  const logoRef = useRef<HTMLImageElement>(null);

  const enterReport = () => {
    if (!userId) {
      return;
    }
    swiper.slideNext();
  };

  const handleKeyDown: React.KeyboardEventHandler<HTMLInputElement> = (event) => {
    if (event.key === 'Enter') {
      // 按下回车时，同步按钮按下状态
      buttonRef.current?.pressDown();
    }
  };

  const handleKeyUp: React.KeyboardEventHandler<HTMLInputElement> = (event) => {
    if (event.key === 'Enter') {
      // 抬起回车时，同步按钮抬起状态并触发点击
      buttonRef.current?.pressUp();
      // 收起手机键盘
      if (userId) {
        inputRef.current?.blur();
        setTimeout(() => {
          setUserId('');
        }, SWIPER_DELAY); // 等切换到下一页后过渡结束后再清除输入框的值
      }
    }
  };

  // GSAP 动画控制
  useEffect(() => {
    if (!isActive) {
      // 重置状态
      setShowTextType1a(false);
      setShowTextType1b(false);
      setShowTextType2a(false);
      setShowTextType2b(false);
      setShowTextType2c(false);
      setShowTextType3(false);

      // 清理所有动画
      const refs = [
        line1ContainerRef.current,
        line2ContainerRef.current,
        line3ContainerRef.current,
        logoRef.current,
      ];
      refs.forEach((ref) => {
        if (ref) gsap.killTweensOf(ref);
      });

      // 重置状态
      if (line1ContainerRef.current) {
        gsap.set(line1ContainerRef.current, { opacity: 0 });
      }
      if (line2ContainerRef.current) {
        gsap.set(line2ContainerRef.current, { opacity: 0 });
      }
      if (line3ContainerRef.current) {
        gsap.set(line3ContainerRef.current, { opacity: 0 });
      }
      if (logoRef.current) {
        gsap.set(logoRef.current, { opacity: 0 });
      }
      return;
    }

    const tl = gsap.timeline();

    // 初始化状态
    if (line1ContainerRef.current) {
      gsap.set(line1ContainerRef.current, { opacity: 0 });
    }
    if (line2ContainerRef.current) {
      gsap.set(line2ContainerRef.current, { opacity: 0 });
    }
    if (line3ContainerRef.current) {
      gsap.set(line3ContainerRef.current, { opacity: 0 });
    }
    if (logoRef.current) {
      gsap.set(logoRef.current, { opacity: 0 });
    }

    // 第一行：和 [logo] 蚂蚁开源一起
    if (line1ContainerRef.current) {
      tl.to(
        line1ContainerRef.current,
        {
          opacity: 1,
          duration: 0.1,
          ease: 'power2.out',
        },
        '+=0.3',
      ).call(
        () => {
          setShowTextType1a(true);
        },
        [],
        '<',
      );
    }

    // 等待"和"字完成后显示 logo 和"蚂蚁开源一起"
    // "和"字大约需要 0.1s（1个字 * 100ms）
    if (line1ContainerRef.current) {
      tl.call(
        () => {
          setShowTextType1b(true);
        },
        [],
        '+=0.1',
      );
    }

    // 同时让 logo 淡入
    if (logoRef.current) {
      tl.to(
        logoRef.current,
        {
          opacity: 1,
          duration: 0.3,
          ease: 'power2.out',
        },
        '<',
      );
    }

    // 等待第一行完成后显示第二行
    // "蚂蚁开源一起" 大约需要 0.6s（6个字 * 100ms）
    if (line2ContainerRef.current) {
      tl.to(
        line2ContainerRef.current,
        {
          opacity: 1,
          duration: 0.3,
          ease: 'power2.out',
        },
        '+=0.6',
      ).call(
        () => {
          setShowTextType2a(true);
        },
        [],
        '<',
      );
    }

    // 等待"开启"完成后显示年份
    // "开启" 大约需要 0.2s（2个字 * 100ms）
    if (line2ContainerRef.current) {
      tl.call(
        () => {
          setShowTextType2b(true);
        },
        [],
        '+=0.2',
      );
    }

    // 等待年份完成后显示"年"
    // "2025" 大约需要 0.4s（4个字符 * 100ms）
    if (line2ContainerRef.current) {
      tl.call(
        () => {
          setShowTextType2c(true);
        },
        [],
        '+=0.4',
      );
    }

    // 等待第二行完成后显示第三行
    // "年"字大约需要 0.1s
    if (line3ContainerRef.current) {
      tl.to(
        line3ContainerRef.current,
        {
          opacity: 1,
          duration: 0.3,
          ease: 'power2.out',
        },
        '+=0.3',
      ).call(
        () => {
          setShowTextType3(true);
        },
        [],
        '<',
      );
    }
  }, [isActive]);

  return (
    <BaseLayout name={PageId.Welcome} logoClassName={styles.pageLogo} hideNavButtons>
      {/* OPEN SOURCE 地址栏 */}
      <div className={styles.topArea}>
        <AddressBar />
      </div>
      {/* 中间区域 */}
      <div className={styles.centerArea}>
        {/* 欢迎语 */}
        <div className={styles.welcome}>
          <div ref={line1ContainerRef} className={styles.firstLine} style={{ opacity: 0 }}>
            {showTextType1a && (
              <TextType
                text="和"
                typingSpeed={75}
                className={styles.textTypeInline}
                showCursor={false}
                loop={false}
              />
            )}
            <img
              ref={logoRef}
              className={styles.logo}
              src={antOpenSourceIcon}
              style={{ opacity: 0 }}
            />
            {showTextType1b && (
              <TextType
                text="蚂蚁开源一起"
                typingSpeed={75}
                className={styles.textTypeInline}
                showCursor={false}
                loop={false}
              />
            )}
          </div>
          <div ref={line2ContainerRef} style={{ opacity: 0 }}>
            {showTextType2a && (
              <TextType
                text="开启"
                typingSpeed={75}
                className={styles.textTypeInline}
                showCursor={false}
                loop={false}
              />
            )}
            {showTextType2b && (
              <TextType
                text="2025"
                typingSpeed={75}
                className={styles.year}
                showCursor={false}
                loop={false}
              />
            )}
            {showTextType2c && (
              <TextType
                text="年"
                typingSpeed={75}
                className={styles.textTypeInline}
                showCursor={false}
                loop={false}
              />
            )}
          </div>
          <div ref={line3ContainerRef} style={{ opacity: 0 }}>
            {showTextType3 && (
              <TextType
                text="我在开源世界的数字回忆"
                typingSpeed={100}
                showCursor={false}
                loop={false}
              />
            )}
          </div>
        </div>
        {/* GitHub ID 输入 */}
        <div className={styles.inputArea}>
          {/* 输入框 */}
          <input
            ref={inputRef}
            className={`${styles.input} ${userId.length < 16 && styles.largeFontSize}`}
            type="text"
            placeholder="输入 GitHub ID 开启年报"
            value={userId}
            onChange={(e) => setUserId(e.target.value)}
            onKeyDown={handleKeyDown}
            onKeyUp={handleKeyUp}
          />
          <PressableButton ref={buttonRef} onClick={enterReport} className={styles.button}>
            <img className={styles.paperPlane} src={paperPlane} />
          </PressableButton>
        </div>
      </div>
      {/* 底部区域 */}
      <div className={styles.bottomArea}>
        {/* 底部栏 */}
        <div className={styles.footerBar} />
        {/* 电脑 */}
        <div className={styles.retroComputer}>
          <RetroComputer>
            <ReportCover />
          </RetroComputer>
        </div>
      </div>
    </BaseLayout>
  );
};

export default WelcomePage;
