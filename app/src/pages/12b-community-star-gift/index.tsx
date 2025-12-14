import { useAppContext } from '@/context';
import { PageId } from '@/pages/types';
import BaseLayout from '@/layouts/BaseLayout';
import EnvelopeLetter from '@/components/EnvelopeLetter';
import Avatar from '@/components/Avatar';
import { useAvatarUrl } from '@/hooks/useAvatarUrl';
import ConfettiSequence from '@/components/ConfettiSequence';
import goldMedal from '@/assets/gold-medal.svg';

import styles from './index.module.scss';

const CommunityStarGiftPage = () => {
  const { data } = useAppContext() as {
    data: NonNullable<ReturnType<typeof useAppContext>['data']>;
  };

  const avatarUrl = useAvatarUrl(data.login);

  return (
    <BaseLayout name={PageId.CommunityStarGift} matrixRainBackgroundColor="#e8e8e8">
      {/* 彩条动画 */}
      <ConfettiSequence />
      {/* 信封和信 */}
      <EnvelopeLetter className={styles.envelopeLetter}>
        {/* 顶部区域 */}
        <div className={styles.topArea}>
          {/* 头像和id */}
          <div className={styles.user}>
            <Avatar src={avatarUrl} className={styles.avatar} isAnt={data.isEmployee} href={`https://github.com/${data.login}`} />
            <div className={styles.login}>@{data.login}</div>
          </div>
        </div>
        {/* 底部区域 */}
        <div className={styles.bottomArea}>
          <div>恭喜你 !</div>
          <div>因为在蚂蚁开源项目中的</div>
          <div>投入与坚持，</div>
          <div>被选为</div>
          <div className={styles.communityStarBanner}>
            <div className={styles.left}>
              <img src={goldMedal} className={styles.goldMedal} />
            </div>
            <div className={styles.right}>
              <div>2025 年度</div>
              <div>蚂蚁开源社区之星</div>
            </div>
          </div>
          <div>
            请在
            <a
              href="https://f.wps.cn/ksform/w/write/IXDeAAqY#routePromt"
              target="_blank"
              rel="noreferrer"
              className={styles.questionnaireLink}
            >
              此问卷
            </a>
            中填写
          </div>
          <div>您的联系方式，</div>
          <div>我们准备了一份礼物。</div>
        </div>
      </EnvelopeLetter>
      <div className={styles.newStory}>
        <div>你和蚂蚁开源的故事</div>
        <div>在这一天，继续书写</div>
      </div>
    </BaseLayout>
  );
};

export default CommunityStarGiftPage;
