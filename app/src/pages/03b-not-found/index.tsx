import { useSwiper } from 'swiper/react';

import ComputerTopLayout from '@/layouts/ComputerTopLayout';
import { PageId } from '@/pages/types';
import PressableButton from '@/components/PressableButton';
import githubLogo from '@/assets/github-logo.svg';
import backButtonNormal from './back-button-normal.png';
import backButtonPressed from './back-button-pressed.png';

import styles from './index.module.scss';

const NotFoundPage = () => {
  const swiper = useSwiper();

  return (
    <ComputerTopLayout
      name={PageId.NotFound}
      hideNavButtons
      screenContent={
        <div className={styles.screenContent}>
          <div className={styles.errorCode}>404</div>
          <div className={styles.notFound}>Not Found</div>
        </div>
      }
      paperContent={
        <div className={styles.paperContent}>
          {/* 顶部区域 */}
          <div className={styles.topArea}>
            <div>
              <span>你尚未踏上</span>
              <span className={styles.year}>2025</span>
              <span>年</span>
            </div>
            <div>在蚂蚁开源项目上的贡献之旅</div>
          </div>
          {/* 中间区域 */}
          <div className={styles.centerArea}>
            <div>访问</div>
            <a
              className={styles.url}
              target="_blank"
              href="https://opensource.antgroup.com"
              rel="noreferrer"
            >
              https://opensource.antgroup.com
            </a>
            <div>了解蚂蚁的开源项目</div>
            <div>期待 2026 年与你相遇！</div>
          </div>
          {/* 返回按钮 */}
          <div className={styles.buttonArea}>
            <PressableButton
              className={`${styles.backButton} swiper-no-swiping`}
              onClick={() => {
                swiper.slideTo(0);
              }}
              normalImage={backButtonNormal}
              pressedImage={backButtonPressed}
              imageAlt="重放"
            />
          </div>
          {/* 底部区域 */}
          <div className={styles.bottomArea}>
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
        </div>
      }
    />
  );
};

export default NotFoundPage;
