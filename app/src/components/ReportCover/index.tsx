import React from 'react';

import styles from './index.module.scss';

const ReportCover: React.FC = () => {
  return (
    <div className={styles.reportCover}>
      <div className={styles.year}>2025</div>
      <div className={styles.title}>开源世界数字回忆</div>
      <div className={styles.openSource}>Open Source</div>
    </div>
  );
};

export default ReportCover;
