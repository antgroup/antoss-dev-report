import React, { useMemo } from 'react';
import antOpenSourceIcon from '@/assets/ant-open-source-icon.png';
import { useOrgAvatarUrl } from '@/hooks/useOrgAvatarUrl';

import styles from './index.module.scss';

interface PixelStyleProjectCardProps {
  repoFullName: string;
  className?: string;
  isAntRepo?: boolean;
}

const PixelStyleProjectCard: React.FC<PixelStyleProjectCardProps> = ({
  repoFullName,
  className,
  isAntRepo,
}) => {
  const orgName = useMemo(() => repoFullName.split('/')[0], [repoFullName]);
  const repoLogo = useOrgAvatarUrl(orgName);

  return (
    <a
      className={`${styles.projectCard} ${className}`}
      href={`https://github.com/${repoFullName}`}
      target="_blank"
      rel="noreferrer"
    >
      <div className={styles.container}>
        <img src={repoLogo} alt={repoFullName} className={styles.repoLogo} />
        <div className={styles.repoFullName}>{repoFullName}</div>
      </div>
      {isAntRepo && (
        <div className={styles.badge}>
          <img src={antOpenSourceIcon} alt="ant open source" className={styles.badgeIcon} />
        </div>
      )}
    </a>
  );
};

export default PixelStyleProjectCard;
