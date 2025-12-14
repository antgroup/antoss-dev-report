import { useAppContext } from '@/context';
import { PageId } from '@/pages/types';
import BaseLayout from '@/layouts/BaseLayout';
import EnvelopeLetter from '@/components/EnvelopeLetter';
import Avatar from '@/components/Avatar';
import { useAvatarUrl } from '@/hooks/useAvatarUrl';
import goldMedal from '@/assets/gold-medal.svg';
import ConfettiSequence from '@/components/ConfettiSequence';
import podium from './podium.png';

import styles from './index.module.scss';

const ThanksPage = () => {
  const { data } = useAppContext() as {
    data: NonNullable<ReturnType<typeof useAppContext>['data']>;
  };

  const avatarUrl = useAvatarUrl(data.login);

  return (
    <BaseLayout name={PageId.EmployeeInvitation} matrixRainBackgroundColor="#e8e8e8">
      {/* 彩条动画 */}
      <ConfettiSequence />
      {/* 信封和信 */}
      <EnvelopeLetter className={styles.envelopeLetter}>
        {/* 顶部区域 */}
        <div className={styles.topArea}>
          {/* 头像和id */}
          <div className={styles.user}>
            <div className={styles.login}>@{data.login}</div>
            <div className={styles.avatarContainer}>
              <Avatar src={avatarUrl} className={styles.avatar} isAnt={data.isEmployee} href={`https://github.com/${data.login}`} />
              <img src={goldMedal} className={styles.goldMedal} />
            </div>
          </div>
          {/* 领奖台背景 */}
          <img src={podium} className={styles.podium} />
        </div>
        <div className={styles.bottomArea}>
          <div>
            <span className={styles.number}>12</span> 月 <span className={styles.number}>25</span>日
            🎄 🎅🏻
          </div>
          <div>
            蚂蚁 a 空间
            <span className={styles.number}>3-315</span> 阶梯教室
          </div>
          <div>
            欢迎参加 <span className={styles.strong}>OpenStar</span> 颁奖典礼
          </div>
          <div>荣光属于所有开源人！</div>
        </div>
      </EnvelopeLetter>
      <div className={styles.newStory}>
        <div>你和蚂蚁开源的故事</div>
        <div>在这一天，继续书写</div>
      </div>
    </BaseLayout>
  );
};

export default ThanksPage;
