import React, { forwardRef } from 'react';
import Avatar from '@/components/Avatar';
import { useOrgAvatarUrl } from '@/hooks/useOrgAvatarUrl';

import styles from './index.module.scss';

interface PixelStyleRepoCardProps {
  repoFullName: string;
  isAnt?: boolean;
  direction?: 'left' | 'right';
}

const PixelStyleRepoCard = forwardRef<HTMLAnchorElement, PixelStyleRepoCardProps>(
  ({ repoFullName, isAnt, direction = 'left' }, ref) => {
    // 从 repoFullName 中提取 owner（第一部分）
    const org = repoFullName ? repoFullName.split('/')[0] || '' : '';
    const repoAvatarUrl = useOrgAvatarUrl(org);

    if (!repoFullName) {
      return <div className={styles.emptyCard} ref={ref as React.RefObject<HTMLDivElement>} />;
    }

    return (
      <a
        ref={ref}
        className={`${styles.repoCard} ${styles[direction]}`}
        href={`https://github.com/${repoFullName}`}
        target="_blank"
        rel="noreferrer"
      >
        <div className={`${styles.content} ${styles[direction]}`}>
          <div className={styles.repoName}>{repoFullName}</div>
        </div>
        <Avatar
          src={repoAvatarUrl}
          isAnt={isAnt}
          className={`${styles.repoAvatar} ${styles[direction]}`}
        />
      </a>
    );
  },
);

PixelStyleRepoCard.displayName = 'PixelStyleRepoCard';

export default PixelStyleRepoCard;
