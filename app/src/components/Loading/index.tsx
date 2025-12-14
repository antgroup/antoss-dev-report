import React, { useRef, useEffect, useState } from 'react';
import styles from './index.module.scss';

export interface LoadingProps {
  /** 进度百分比，范围 0-100 */
  progress?: number;
  /** 进度条格子数量，默认根据进度条宽度自动计算 */
  gridCount?: number;
  /** 自定义类名 */
  className?: string;
  /** 目标宽度，用于缩放 */
  width?: number | string;
  /** 目标高度，用于缩放 */
  height?: number | string;
}

// Loading 组件的原始尺寸（SVG + 文字）
const ORIGINAL_WIDTH = 243; // SVG 宽度
const ORIGINAL_HEIGHT = 40; // SVG 高度
const LOADING_TEXT_HEIGHT = 34; // LOADING 文字高度（根据字体大小估算）
const PERCENT_TEXT_HEIGHT = 34; // 百分比文字高度（根据字体大小估算）
const TEXT_GAP = 12; // 文字与进度条之间的间距
const TOTAL_ORIGINAL_HEIGHT =
  LOADING_TEXT_HEIGHT + TEXT_GAP + ORIGINAL_HEIGHT + 16 + PERCENT_TEXT_HEIGHT; // 总高度

/**
 * 像素风格Loading进度条组件
 * 基于SVG实现，根据进度条宽度动态计算格子尺寸
 */
const Loading: React.FC<LoadingProps> = ({ progress = 0, gridCount, className, width, height }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(1);

  // 确保进度在0-100范围内
  const clampedProgress = Math.max(0, Math.min(100, progress));

  // 从SVG中提取的进度条尺寸（基于viewBox="0 0 243 40"）
  // 进度条上边框：x="9.46368715" y="0" width="223.072626" height="5.40782123"
  // 进度条下边框：x="9.46368715" y="33.7988827" width="223.072626" height="5.40782123"
  const progressBarStartX = 9.46368715; // 进度条起始x坐标
  const progressBarContentWidth = 223.072626; // 进度条内容区域宽度

  // 从参考设计提取的格子参数（相对于进度条起始位置）
  // 第一个格子：x="14.8372817" y="10.4046467" width="9.46368715" height="18.3626335"
  // 第二个格子：x="29.70879" y="10.4046467"
  const leftPadding = 14.8372817 - 9.46368715; // 5.37359355
  const gridStartY = 10.4046467; // 格子起始y坐标
  const gridHeight = 18.3626335; // 格子高度

  // 计算格子宽度和间距
  // 从参考设计：第一个格子x=14.8372817, 第二个格子x=29.70879
  // 格子宽度 = 9.46368715
  // 格子间距 = 29.70879 - 14.8372817 - 9.46368715 = 5.40782115
  const referenceGridWidth = 9.46368715;
  const referenceGridSpacing = 5.40782115;

  // 计算可用宽度（减去左右内边距）
  const rightPadding = leftPadding; // 假设对称
  const availableWidth = progressBarContentWidth - leftPadding - rightPadding;

  // 计算实际可容纳的格子数量
  const actualGridCount = Math.floor(
    (availableWidth + referenceGridSpacing) / (referenceGridWidth + referenceGridSpacing),
  );

  // 使用传入的gridCount或计算出的实际数量
  const finalGridCount = gridCount || actualGridCount;

  // 根据格子数量重新计算每个格子的宽度和间距，确保填满可用空间
  // 如果格子数量固定，需要调整格子宽度或间距
  const totalSpacing = (finalGridCount - 1) * referenceGridSpacing;
  const calculatedGridWidth = (availableWidth - totalSpacing) / finalGridCount;

  // 计算需要填充的格子数量
  const filledGridCount = Math.floor((clampedProgress / 100) * finalGridCount);

  // 绿色格子颜色（从参考SVG提取）
  const gridColor = '#39B448';

  // 计算缩放比例
  useEffect(() => {
    const updateScale = () => {
      if (!containerRef.current || !contentRef.current) return;

      const container = containerRef.current;
      const content = contentRef.current;

      // 如果指定了 width 和 height，使用指定值；否则使用容器的实际尺寸
      let targetWidth: number;
      let targetHeight: number;

      if (width && height) {
        targetWidth = typeof width === 'string' ? parseFloat(width) : width;
        targetHeight = typeof height === 'string' ? parseFloat(height) : height;
      } else {
        targetWidth = container.offsetWidth;
        targetHeight = container.offsetHeight;
      }

      if (targetWidth === 0 || targetHeight === 0) return;

      // 获取内容的原始尺寸
      const contentWidth = content.scrollWidth || ORIGINAL_WIDTH;
      const contentHeight = content.scrollHeight || TOTAL_ORIGINAL_HEIGHT;

      if (contentWidth === 0 || contentHeight === 0) return;

      // 计算缩放比例，使内容完全填充容器（保持宽高比）
      const scaleX = targetWidth / contentWidth;
      const scaleY = targetHeight / contentHeight;
      const newScale = Math.min(scaleX, scaleY);

      setScale(newScale);
    };

    // 使用 requestAnimationFrame 确保 DOM 已更新
    const rafId = requestAnimationFrame(() => {
      updateScale();
    });

    // 如果指定了 width 和 height，监听窗口大小变化
    if (width && height) {
      window.addEventListener('resize', updateScale);
    }

    // 使用 ResizeObserver 监听容器和内容尺寸变化
    const resizeObserver = new ResizeObserver(() => {
      requestAnimationFrame(updateScale);
    });

    if (containerRef.current) {
      resizeObserver.observe(containerRef.current);
    }
    if (contentRef.current) {
      resizeObserver.observe(contentRef.current);
    }

    return () => {
      cancelAnimationFrame(rafId);
      if (width && height) {
        window.removeEventListener('resize', updateScale);
      }
      resizeObserver.disconnect();
    };
  }, [width, height]);

  // 容器样式
  const containerStyle: React.CSSProperties = {};
  if (width) {
    containerStyle.width = typeof width === 'string' ? width : `${width}px`;
  }
  if (height) {
    containerStyle.height = typeof height === 'string' ? height : `${height}px`;
  }

  return (
    <div
      ref={containerRef}
      className={`${styles.loadingContainer} ${className || ''}`}
      style={containerStyle}
    >
      <div
        ref={contentRef}
        className={styles.loadingWrapper}
        style={{
          transform: `scale(${scale})`,
          transformOrigin: 'center center',
        }}
      >
        {/* LOADING 文字 */}
        <div className={styles.loadingText}>LOADING</div>

        {/* 进度条SVG */}
        <div className={styles.progressBarContainer}>
          <svg
            width="100%"
            height="100%"
            viewBox="0 0 243 40"
            version="1.1"
            xmlns="http://www.w3.org/2000/svg"
            className={styles.progressBarSvg}
          >
            <g id="页面-1" stroke="none" strokeWidth="1" fill="none" fillRule="evenodd">
              <g id="第0页-Loading" transform="translate(-120, -181)" fill="#000000">
                <g id="编组" transform="translate(120.3581, 180)">
                  <g transform="translate(0, 1.067)">
                    {/* 进度条边框 */}
                    <rect id="矩形-6" x="9.46368715" y="0" width="223.072626" height="5.40782123" />
                    <rect
                      id="矩形-6备份"
                      x="9.46368715"
                      y="33.7988827"
                      width="223.072626"
                      height="5.40782123"
                    />
                    <polygon
                      id="矩形-6备份-2"
                      transform="translate(239.2961, 19.586) rotate(-90) translate(-239.2961, -19.586)"
                      points="229.832402 16.8820528 248.759777 16.8820528 248.759777 22.289874 229.832402 22.289874"
                    />
                    <polygon
                      id="矩形-6备份-5"
                      transform="translate(234.5642, 7.7668) rotate(-90) translate(-234.5642, -7.7668)"
                      points="232.198324 5.7389146 236.930168 5.7389146 236.930168 9.79478052 232.198324 9.79478052"
                    />
                    <polygon
                      id="矩形-6备份-6"
                      transform="translate(234.5642, 31.4051) rotate(-90) translate(-234.5642, -31.4051)"
                      points="232.198324 29.3771463 236.930168 29.3771463 236.930168 33.4330122 232.198324 33.4330122"
                    />
                    <g transform="translate(4.7318, 19.586) scale(-1, 1) translate(-4.7318, -19.586)translate(0, 5.403)">
                      <polygon
                        id="矩形-6备份-3"
                        transform="translate(6.7598, 14.1829) rotate(-90) translate(-6.7598, -14.1829)"
                        points="-2.70391061 11.4790284 16.2234637 11.4790284 16.2234637 16.8868496 -2.70391061 16.8868496"
                      />
                      <polygon
                        id="矩形-6备份-8"
                        transform="translate(2.0279, 2.3659) rotate(-90) translate(-2.0279, -2.3659)"
                        points="-0.337988827 0.337988827 4.39385475 0.337988827 4.39385475 4.39385475 -0.337988827 4.39385475"
                      />
                      <polygon
                        id="矩形-6备份-7"
                        transform="translate(2.0279, 26) rotate(-90) translate(-2.0279, -26)"
                        points="-0.337988827 23.9720233 4.39385475 23.9720233 4.39385475 28.0278892 -0.337988827 28.0278892"
                      />
                    </g>

                    {/* 进度条内部绿色格子 */}
                    {Array.from({ length: finalGridCount }).map((_, index) => {
                      const gridX =
                        progressBarStartX +
                        leftPadding +
                        index * (calculatedGridWidth + referenceGridSpacing);
                      const isFilled = index < filledGridCount;

                      return (
                        <rect
                          key={`grid-${index}`}
                          x={gridX}
                          y={gridStartY}
                          width={calculatedGridWidth}
                          height={gridHeight}
                          fill={isFilled ? gridColor : 'transparent'}
                          className={styles.progressGrid}
                        />
                      );
                    })}
                  </g>
                </g>
              </g>
            </g>
          </svg>
        </div>

        {/* 百分比文字 */}
        <div className={styles.percentText}>{Math.round(clampedProgress)}%</div>
      </div>
    </div>
  );
};

export default Loading;
