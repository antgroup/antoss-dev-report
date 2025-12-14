import React from 'react';

import styles from './index.module.scss';

interface PixelStyleBubbleProps {
  children: React.ReactNode;
  className?: string;
}

const PixelStyleBubble: React.FC<PixelStyleBubbleProps> = ({ children, className }) => {
  return <div className={`${styles.pixelStyleBubble} ${className}`}>{children}</div>;
};

export default PixelStyleBubble;
