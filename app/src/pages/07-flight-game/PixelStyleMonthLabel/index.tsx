import React from 'react';

import styles from './index.module.scss';

interface PixelStyleMonthLabelProps {
  month: string;
  className?: string;
}

const PixelStyleMonthLabel: React.FC<PixelStyleMonthLabelProps> = ({ month, className }) => {
  return (
    <div className={`${styles.pixelStyleMonthLabel} ${className}`}>
      <div className={styles.monthLabelText}>{month}月</div>
    </div>
  );
};

export default PixelStyleMonthLabel;
