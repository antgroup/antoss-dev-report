import React, { ReactNode, useRef, useEffect, useState } from 'react';

import styles from './index.module.scss';

interface RetroComputerProps {
  children?: ReactNode;
  className?: string;
  variant?: 'normal' | 'printer';
  onlyDesk?: boolean;
  screenScale?: number;
}

/**
 * 让children渲染在电脑屏幕黑框中，且会跟随svg缩放
 */
const RetroComputer: React.FC<RetroComputerProps> = ({
  children,
  className,
  variant = 'normal',
  onlyDesk = false,
  screenScale = 1,
}) => {
  // 人眼微调的距离
  const MANUAL_ADJUST_DISTANCE = 70 * (1 - screenScale);
  // 显示器外壳的尺寸
  const SCREEN_CASE_TOP = 0;
  const SCREEN_CASE_BOTTOM = 252.356378;
  const SCREEN_CASE_HEIGHT = SCREEN_CASE_BOTTOM - SCREEN_CASE_TOP; // 232.5777414
  const SCREEN_X = 178.467698;
  const SCREEN_Y = 60.2558464;
  const SCREEN_WIDTH = 284.467865;
  const SCREEN_HEIGHT = 146.103702;
  const SCREEN_STROKE_WIDTH = 9.34387698; // 矩形5的边框宽度
  const SVG_VIEWBOX_WIDTH = 621;
  const SVG_VIEWBOX_HEIGHT = 371 - (1 - screenScale) * SCREEN_CASE_HEIGHT - MANUAL_ADJUST_DISTANCE;
  const DESK_START_Y = 237.6374 - (1 - screenScale) * SCREEN_CASE_HEIGHT - MANUAL_ADJUST_DISTANCE; // 底座开始的 y 坐标
  const DESK_HEIGHT = SVG_VIEWBOX_HEIGHT - DESK_START_Y; // 底座高度

  const containerRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(1);

  useEffect(() => {
    const updateScale = () => {
      if (!containerRef.current || !contentRef.current) return;

      const container = containerRef.current;
      const content = contentRef.current;

      // 获取容器的实际尺寸（屏幕区域）
      const containerWidth = container.offsetWidth;
      const containerHeight = container.offsetHeight;

      if (containerWidth === 0 || containerHeight === 0) return;

      // 获取内容的原始尺寸（scrollWidth/scrollHeight 不受 transform 影响）
      const contentWidth = content.scrollWidth || content.offsetWidth;
      const contentHeight = content.scrollHeight || content.offsetHeight;

      if (contentWidth === 0 || contentHeight === 0) return;

      // 计算缩放比例，使内容完全填充容器（保持宽高比）
      const scaleX = containerWidth / contentWidth;
      const scaleY = containerHeight / contentHeight;
      const newScale = Math.min(scaleX, scaleY);

      setScale(newScale);
    };

    // 使用 requestAnimationFrame 确保 DOM 已更新
    const rafId = requestAnimationFrame(() => {
      updateScale();
    });

    // 监听窗口大小变化
    window.addEventListener('resize', updateScale);

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
      window.removeEventListener('resize', updateScale);
      resizeObserver.disconnect();
    };
  }, [children]);

  // 根据 onlyDesk 计算 viewBox
  const viewBox = onlyDesk
    ? `0 ${DESK_START_Y} ${SVG_VIEWBOX_WIDTH} ${DESK_HEIGHT}`
    : `0 0 ${SVG_VIEWBOX_WIDTH} ${SVG_VIEWBOX_HEIGHT}`;

  // 计算缩放后的屏幕区域位置和尺寸
  // transformOrigin 是 'top center'，即缩放中心在显示器外壳的顶部中心
  const originX = SVG_VIEWBOX_WIDTH / 2;
  const originY = SCREEN_CASE_TOP; // 显示器外壳的顶部

  // 屏幕区域（考虑边框）
  const screenLeft = SCREEN_X + SCREEN_STROKE_WIDTH / 2;
  const screenTop = SCREEN_Y + SCREEN_STROKE_WIDTH / 2;
  const screenWidth = SCREEN_WIDTH - SCREEN_STROKE_WIDTH;
  const screenHeight = SCREEN_HEIGHT - SCREEN_STROKE_WIDTH;

  // 缩放后的位置和尺寸
  const scaledLeft = originX + (screenLeft - originX) * screenScale;
  const scaledTop = originY + (screenTop - originY) * screenScale;
  const scaledWidth = screenWidth * screenScale;
  const scaledHeight = screenHeight * screenScale;

  // 转换为百分比
  const containerLeft = (scaledLeft / SVG_VIEWBOX_WIDTH) * 100;
  const containerTop = (scaledTop / SVG_VIEWBOX_HEIGHT) * 100;
  const containerWidth = (scaledWidth / SVG_VIEWBOX_WIDTH) * 100;
  const containerHeight = (scaledHeight / SVG_VIEWBOX_HEIGHT) * 100;

  return (
    <div className={`${styles.retroComputer} ${className}`}>
      <svg
        width="100%"
        height="100%"
        viewBox={viewBox}
        version="1.1"
        xmlns="http://www.w3.org/2000/svg"
        style={{ display: 'block' }}
      >
        <g id="desk" transform={`translate(0, ${DESK_START_Y})`}>
          <polygon
            id="矩形-3"
            fill="#7F7F7F"
            points="108.72875 0 617.120602 1.34016365e-13 617.120602 95.2369211 598.85757 113.82541 590.363136 121.470401 22.9349708 111.482805 22.9349708 38.0969121"
          />
          <rect
            id="矩形备份-2"
            fill="#BEBEBE"
            x="23.1394448"
            y="36.5260646"
            width="559.783175"
            height="73.0521291"
          />
          <rect
            id="矩形备份-2"
            fill="#FFFFFF"
            x="11.9459545"
            y="36.5260646"
            width="570.825939"
            height="11.8922071"
          />
          <rect
            id="矩形备份-7"
            fill="#7F7F7F"
            x="11.9459545"
            y="25.4833009"
            width="570.825939"
            height="11.8922071"
          />
          <rect
            id="矩形备份-8"
            fill="#7F7F7F"
            x="11.9459545"
            y="113.82541"
            width="579.320373"
            height="7.64499026"
          />
          <rect
            id="矩形备份-9"
            fill="#000000"
            x="15.2899805"
            y="121.470401"
            width="575.922599"
            height="11.8922071"
          />
          <polygon
            id="矩形备份-5"
            fill="#FFFFFF"
            transform="translate(17.5425, 72.7026) rotate(-90) translate(-17.5425, -72.7026)"
            points="-18.9835525 66.7564796 54.0685767 66.7564796 54.0685767 78.6486867 -18.9835525 78.6486867"
          />
          <polygon
            id="矩形备份-6"
            fill="#7F7F7F"
            transform="translate(5.9461, 78.5735) rotate(-90) translate(-5.9461, -78.5735)"
            points="-36.9507862 72.6274074 48.8429933 72.6274074 48.8429933 84.5196145 -36.9507862 84.5196145"
          />
          <polygon
            id="矩形备份-10"
            fill="#000000"
            transform="translate(595.0351, 117.6479) rotate(-90) translate(-595.0351, -117.6479)"
            points="591.21258 113.82541 598.85757 113.82541 598.85757 121.470401 591.21258 121.470401"
          />
          <polygon
            id="矩形备份-11"
            fill="#000000"
            transform="translate(602.6801, 110.0029) rotate(-90) translate(-602.6801, -110.0029)"
            points="598.85757 106.18042 606.50256 106.18042 606.50256 113.82541 598.85757 113.82541"
          />
          <polygon
            id="矩形备份-12"
            fill="#000000"
            transform="translate(610.3251, 102.3579) rotate(-90) translate(-610.3251, -102.3579)"
            points="606.50256 98.53543 614.147551 98.53543 614.147551 106.18042 606.50256 106.18042"
          />
          <polygon
            id="矩形备份-16"
            fill="#BEBEBE"
            transform="translate(586.5406, 32.7036) rotate(-90) translate(-586.5406, -32.7036)"
            points="582.718146 28.8810743 590.363136 28.8810743 590.363136 36.5260646 582.718146 36.5260646"
          />
          <polygon
            id="矩形备份-15"
            fill="#BEBEBE"
            transform="translate(594.1856, 25.0586) rotate(-90) translate(-594.1856, -25.0586)"
            points="590.363136 21.236084 598.008127 21.236084 598.008127 28.8810743 590.363136 28.8810743"
          />
          <polygon
            id="矩形备份-14"
            fill="#BEBEBE"
            transform="translate(601.8306, 17.4136) rotate(-90) translate(-601.8306, -17.4136)"
            points="598.008127 13.5910938 605.653117 13.5910938 605.653117 21.236084 598.008127 21.236084"
          />
          <polygon
            id="矩形备份-13"
            fill="#000000"
            transform="translate(617.97, 66.6813) rotate(-90) translate(-617.97, -66.6813)"
            points="586.11592 62.8588088 649.824172 62.8588088 649.824172 70.503799 586.11592 70.503799"
          />
          {variant === 'printer' && (
            <rect data-paper-slot x="74" y="59" width="490" height="40" rx="22" fill="#000000" />
          )}
          {variant === 'normal' && (
            <>
              <rect
                id="底座右侧白条"
                stroke="#000000"
                strokeWidth="2.54833009"
                fill="#000000"
                x="413.572052"
                y="62.0093654"
                width="161.925826"
                height="33.1282911"
              />
              <rect
                id="底座右侧灰条"
                fill="#ECECEC"
                x="412.297887"
                y="60.3077385"
                width="164.474156"
                height="18.0520415"
              />
            </>
          )}

          <rect
            id="矩形"
            fill="#03FD07"
            x="31.0192468"
            y="73.0675748"
            width="34.8435375"
            height="14.4435904"
          />
          <rect
            id="矩形备份"
            fill="#028000"
            x="31.0192468"
            y="89.210411"
            width="34.8435375"
            height="14.4435904"
          />
        </g>
        {!onlyDesk && (
          <g
            id="screen"
            style={{
              transform: `scale(${screenScale})`,
              transformOrigin: 'top center',
            }}
          >
            <polygon
              id="矩形"
              fill="#7F7F7F"
              points="165.588586 19.7786366 514.452011 19.7786366 514.452011 222.048606 505.411343 236.595615 481.330826 252.356378 165.588586 252.356378"
            />
            <polygon
              id="矩形"
              fill="#BFBFBF"
              points="165.588586 26.2181927 485.01404 26.2181927 485.01404 206.086555 485.01404 233.037709 454.687704 233.037709 165.588586 233.037709"
            />
            {/* 屏幕（黑框） */}
            <rect
              id="矩形-5"
              stroke="#000000"
              strokeWidth={SCREEN_STROKE_WIDTH}
              fill="#FFFFFF"
              x={SCREEN_X}
              y={SCREEN_Y}
              width={SCREEN_WIDTH}
              height={SCREEN_HEIGHT}
            />
            <polygon
              id="矩形-4备份-5"
              fill="#BEBEBE"
              points="175.2278 12.4191439 500.652962 12.4191439 484.509215 27.8908047 484.509215 35.6826872 147.189854 40.0172415"
            />
            <rect
              id="矩形-4"
              fill="#000000"
              x="123.271503"
              y="243.157012"
              width="374.62165"
              height="11.9591756"
            />
            <rect
              id="矩形-4备份-8"
              fill="#BEBEBE"
              x="164.668649"
              y="39.0973049"
              width="319.425455"
              height="11.9591756"
            />
            <rect
              id="矩形-4备份-6"
              fill="#7F7F7F"
              x="175.707888"
              y="0.459968293"
              width="337.824187"
              height="11.9591756"
            />
            <rect
              id="矩形-4备份-2"
              fill="#FFFFFF"
              x="164.668649"
              y="26.2181927"
              width="319.425455"
              height="11.9591756"
            />
            <rect
              id="矩形-4备份-10"
              fill="#FFFFFF"
              x="178.467698"
              y="205.439612"
              width="296.42704"
              height="11.9591756"
            />
            <rect
              id="矩形-4备份-9"
              fill="#7F7F7F"
              x="178.467698"
              y="48.2966708"
              width="290.907421"
              height="11.9591756"
            />
            <polygon
              id="矩形-4备份-3"
              fill="#FFFFFF"
              transform="translate(158.6891, 133.3908) rotate(-90) translate(-158.6891, -133.3908)"
              points="63.4756245 127.411217 253.902498 127.411217 253.902498 139.370393 63.4756245 139.370393"
            />
            <polygon
              id="矩形-4备份-7"
              fill="#FFFFFF"
              transform="translate(468.9152, 132.4709) rotate(-90) translate(-468.9152, -132.4709)"
              points="383.821016 126.491281 554.009284 126.491281 554.009284 138.450456 383.821016 138.450456"
            />
            <polygon
              id="矩形-4备份-4"
              fill="#7F7F7F"
              transform="translate(147.1899, 136.1506) rotate(-90) translate(-147.1899, -136.1506)"
              points="45.9968293 130.171027 248.382878 130.171027 248.382878 142.130203 45.9968293 142.130203"
            />
            <polygon
              id="矩形-4备份"
              fill="#000000"
              transform="translate(517.6718, 127.4112) scale(1, -1) rotate(90) translate(-517.6718, -127.4112)"
              points="416.018796 123.731471 619.324782 123.731471 619.324782 131.090964 416.018796 131.090964"
            />
            <polygon
              id="矩形备份-10"
              fill="#000000"
              transform="translate(502.4928, 240.3972) rotate(-90) translate(-502.4928, -240.3972)"
              points="498.813089 236.717456 506.172582 236.717456 506.172582 244.076948 498.813089 244.076948"
            />
            <polygon
              id="矩形备份-17"
              fill="#000000"
              transform="translate(509.8523, 233.0377) rotate(-90) translate(-509.8523, -233.0377)"
              points="506.172582 229.357963 513.532075 229.357963 513.532075 236.717456 506.172582 236.717456"
            />
            <polygon
              id="矩形备份-19"
              fill="#FFFFFF"
              transform="translate(488.6938, 23.4584) rotate(-90) translate(-488.6938, -23.4584)"
              points="485.01404 19.7786366 492.373533 19.7786366 492.373533 27.1381293 485.01404 27.1381293"
            />
            <polygon
              id="矩形备份-18"
              fill="#FFFFFF"
              transform="translate(496.0533, 15.179) rotate(-90) translate(-496.0533, -15.179)"
              points="492.373533 11.4992073 499.733026 11.4992073 499.733026 18.8587 492.373533 18.8587"
            />
            <polygon
              id="矩形备份-21"
              fill="#7F7F7F"
              transform="translate(156.3892, 30.8179) rotate(-90) translate(-156.3892, -30.8179)"
              points="152.709473 27.1381293 160.068966 27.1381293 160.068966 34.497622 152.709473 34.497622"
            />
            <polygon
              id="矩形备份-20"
              fill="#7F7F7F"
              transform="translate(163.7487, 23.4584) rotate(-90) translate(-163.7487, -23.4584)"
              points="160.068966 19.7786366 167.428459 19.7786366 167.428459 27.1381293 160.068966 27.1381293"
            />
            <polygon
              id="矩形备份-22"
              fill="#7F7F7F"
              transform="translate(171.1082, 15.179) rotate(-90) translate(-171.1082, -15.179)"
              points="167.428459 11.4992073 174.787951 11.4992073 174.787951 18.8587 167.428459 18.8587"
            />
            <polygon
              id="矩形备份-23"
              fill="#7F7F7F"
              transform="translate(507.0925, 13.799) rotate(-90) translate(-507.0925, -13.799)"
              points="493.29347 6.8995244 520.891567 6.8995244 520.891567 20.6985732 493.29347 20.6985732"
            />
          </g>
        )}
      </svg>
      {/* 用绝对定位让children覆盖在屏幕黑框内，且自适应缩放 */}
      {!onlyDesk && (
        <div
          ref={containerRef}
          style={{
            position: 'absolute',
            left: `${containerLeft}%`,
            top: `${containerTop}%`,
            width: `${containerWidth}%`,
            height: `${containerHeight}%`,
            pointerEvents: 'none', // 默认不影响鼠标事件（如需交互可以移除）
            overflow: 'hidden',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          {/* 子内容撑满屏幕 */}
          <div
            ref={contentRef}
            style={{
              transform: `scale(${scale})`,
              transformOrigin: 'center center',
            }}
          >
            {children}
          </div>
        </div>
      )}
    </div>
  );
};

export default RetroComputer;
