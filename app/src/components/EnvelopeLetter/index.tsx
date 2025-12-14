import React from 'react';

import goldMedal from '@/assets/gold-medal.svg';
import backgroundMedal from './background-gold-medal.svg';

import styles from './index.module.scss';

interface EnvelopeLetterProps {
  children: React.ReactNode;
  className?: string;
  showTopRightMedal?: boolean;
  showBackgroundMedal?: boolean;
}

const EnvelopeLetter: React.FC<EnvelopeLetterProps> = ({
  className,
  children,
  showTopRightMedal,
  showBackgroundMedal,
}) => {
  return (
    <div className={`${styles.envelopeLetter} ${className}`}>
      {showTopRightMedal && <img src={goldMedal} className={styles.topRightMedal} />}
      {showBackgroundMedal && <img src={backgroundMedal} className={styles.backgroundMedal} />}
      {children}
    </div>
  );
};

export default EnvelopeLetter;
