import React, { useRef, useEffect, useState } from 'react';

import styles from './index.module.scss';

interface PixelStyleContainerProps {
  children: React.ReactNode;
  style?: React.CSSProperties;
  className?: string;
  borderWidth?: number;
  borderColor?: string;
  cornerSize?: number;
}

const PixelStyleContainer: React.FC<PixelStyleContainerProps> = ({
  children,
  style,
  className,
  borderWidth = 2,
  borderColor = '#000',
  cornerSize = 6,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });

  useEffect(() => {
    const updateDimensions = () => {
      if (containerRef.current) {
        const { offsetWidth, offsetHeight } = containerRef.current;
        setDimensions({ width: offsetWidth, height: offsetHeight });
      }
    };

    updateDimensions();

    const resizeObserver = new ResizeObserver(updateDimensions);
    if (containerRef.current) {
      resizeObserver.observe(containerRef.current);
    }

    return () => {
      resizeObserver.disconnect();
    };
  }, []);

  // 生成像素风格的 path，带有向内凹陷的L型角效果
  const generatePixelPath = () => {
    const w = dimensions.width;
    const h = dimensions.height;
    const c = cornerSize; // 内折角大小
    const b = borderWidth / 2; // 边框宽度的一半，用于居中

    // 创建四个角向内凹陷的路径（顺时针，从左上角内折后开始）
    return `
      M ${c} ${b}
      L ${c} ${c}
      L ${b} ${c}
      L ${b} ${h - c}
      L ${c} ${h - c}
      L ${c} ${h - b}
      L ${w - c} ${h - b}
      L ${w - c} ${h - c}
      L ${w - b} ${h - c}
      L ${w - b} ${c}
      L ${w - c} ${c}
      L ${w - c} ${b}
      Z
    `;
  };

  return (
    <div
      ref={containerRef}
      style={style}
      className={`${styles.pixelStyleContainer} ${className || ''}`}
    >
      {dimensions.width > 0 && dimensions.height > 0 && (
        <svg
          className={styles.borderSvg}
          width={dimensions.width}
          height={dimensions.height}
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            pointerEvents: 'none',
            zIndex: 1,
          }}
        >
          <path
            d={generatePixelPath()}
            fill="none"
            stroke={borderColor}
            strokeWidth={borderWidth}
            vectorEffect="non-scaling-stroke"
          />
        </svg>
      )}
      <div className={styles.content}>{children}</div>
    </div>
  );
};

export default PixelStyleContainer;
