import React, { useState, useEffect } from 'react';
import { useSwiper } from 'swiper/react';

import MatrixRain from '@/components/MatrixRain';
import antOpenSourceLogo from '@/assets/ant-open-source-logo.png';
import antOpenSourceLogoWhite from '@/assets/ant-open-source-logo-white.png';
import slideToPrevButton from './slide-to-prev-button.svg';
import slideToNextButton from './slide-to-next-button.svg';

import styles from './index.module.scss';

export interface BaseLayoutProps {
  name: string;
  children?: React.ReactNode;
  logoClassName?: string;
  theme?: 'light' | 'dark';
  matrixRainBackgroundColor?: string;
  logoTheme?: 'light' | 'dark';
  hideLogo?: boolean;
  hideNavButtons?: boolean;
}

const BaseLayout: React.FC<BaseLayoutProps> = ({
  name,
  children,
  logoClassName,
  theme = 'light',
  matrixRainBackgroundColor,
  logoTheme = theme,
  hideLogo = false,
  hideNavButtons = false,
}) => {
  const swiper = useSwiper();
  const [canGoPrev, setCanGoPrev] = useState(false);
  const [canGoNext, setCanGoNext] = useState(false);

  useEffect(() => {
    const updateNavigationState = () => {
      setCanGoPrev(!swiper.isBeginning);
      setCanGoNext(!swiper.isEnd);
    };

    const handleReachBeginning = () => setCanGoPrev(false);
    const handleReachEnd = () => setCanGoNext(false);

    // 初始状态
    updateNavigationState();

    // 监听 slide 变化
    swiper.on('slideChange', updateNavigationState);
    swiper.on('reachBeginning', handleReachBeginning);
    swiper.on('reachEnd', handleReachEnd);

    return () => {
      swiper.off('slideChange', updateNavigationState);
      swiper.off('reachBeginning', handleReachBeginning);
      swiper.off('reachEnd', handleReachEnd);
    };
  }, [swiper]);

  const handlePrev = () => {
    if (canGoPrev) {
      swiper.slidePrev();
    }
  };

  const handleNext = () => {
    if (canGoNext) {
      swiper.slideNext();
    }
  };

  return (
    <div key={`page-${name}`} className={styles.overlay}>
      <div className={styles.blur}>
        {/* 上一页按钮 */}
        {!hideNavButtons && (
          <button
            className={`${styles.navButton} ${styles.prevButton}`}
            onClick={handlePrev}
            disabled={!canGoPrev}
            aria-label="上一页"
          >
            <img src={slideToPrevButton} alt="上一页" />
          </button>
        )}
        <div className={styles.container}>
          <div className={styles.matrixRainContainer}>
            <MatrixRain density={0.4} theme={theme} backgroundColor={matrixRainBackgroundColor} />
          </div>
          <div className={styles.content}>{children}</div>
          {!hideLogo && (
            <img
              className={`${styles.logo} ${logoClassName}`}
              src={logoTheme === 'dark' ? antOpenSourceLogoWhite : antOpenSourceLogo}
            />
          )}
        </div>
        {/* 下一页按钮 */}
        {!hideNavButtons && (
          <button
            className={`${styles.navButton} ${styles.nextButton}`}
            onClick={handleNext}
            disabled={!canGoNext}
            aria-label="下一页"
          >
            <img src={slideToNextButton} alt="下一页" />
          </button>
        )}
      </div>
    </div>
  );
};

export default BaseLayout;
