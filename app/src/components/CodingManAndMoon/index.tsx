import React, { useEffect, useState, useMemo, useRef } from 'react';
import { useSpring, animated, easings } from '@react-spring/web';
import moonImage from './moon.png';
import codingManImage from './a-coding-man.png';
import styles from './index.module.scss';

interface CodingManAndMoonProps {
  className?: string;
}

const CodingManAndMoon: React.FC<CodingManAndMoonProps> = ({ className }) => {
  const [step, setStep] = useState(0);
  const [opacity, setOpacity] = useState(1); // 控制透明度
  const containerRef = useRef<HTMLDivElement>(null);
  const codingManRef = useRef<HTMLImageElement>(null);
  const [centerPercent, setCenterPercent] = useState(50); // coding man 的中心百分比

  // 计算 coding man 的中心位置
  useEffect(() => {
    const updateCenterPercent = () => {
      if (containerRef.current && codingManRef.current) {
        const containerWidth = containerRef.current.offsetWidth;
        const codingManRect = codingManRef.current.getBoundingClientRect();
        const containerRect = containerRef.current.getBoundingClientRect();

        // 计算 coding man 中心相对于 container 的百分比
        const codingManCenterX = codingManRect.left + codingManRect.width / 2 - containerRect.left;
        const centerPct = (codingManCenterX / containerWidth) * 100;
        setCenterPercent(centerPct);
      }
    };

    // 初始计算
    updateCenterPercent();

    // 监听窗口大小变化
    window.addEventListener('resize', updateCenterPercent);
    return () => window.removeEventListener('resize', updateCenterPercent);
  }, []);

  // 生成抛物线上的点（使用 useMemo 避免重复计算）
  const positions = useMemo(() => {
    // 抛物线公式: y = -maxHeight * (1 - ((x - center) / range)^2)
    const maxHeight = 15; // 抛物线最高点的高度（向上偏移 15px，降低坡度）
    const leftMargin = 10; // 左边距百分比
    const rightMargin = 10; // 右边距百分比

    const generateParabolicPoints = (start: number, end: number, steps: number) => {
      const points = [];
      for (let i = 0; i <= steps; i++) {
        const t = i / steps;
        const x = start + (end - start) * t;
        // 计算相对于对称轴的归一化距离
        const range = Math.max(
          Math.abs(centerPercent - leftMargin),
          Math.abs(100 - rightMargin - centerPercent),
        );
        const distanceFromCenter = (x - centerPercent) / range;
        // 抛物线公式：在对称轴处达到最大高度
        const y = -maxHeight * (1 - distanceFromCenter * distanceFromCenter);
        points.push({ x, y });
      }
      return points;
    };

    // 只生成从左到右的路径，每次循环都从左边开始
    return generateParabolicPoints(leftMargin, 100 - rightMargin, 20); // 20个点，保持流畅
  }, [centerPercent]);

  // 使用 react-spring 创建月亮的弧线运动动画
  const moonAnimation = useSpring({
    x: positions[step].x,
    y: positions[step].y,
    opacity,
    config: {
      duration: 200, // 每个点之间 0.2 秒，加快速度
      easing: easings.linear, // 使用线性插值，因为点已经在抛物线上了
    },
  });

  // 循环切换步骤
  useEffect(() => {
    const stepDuration = 200; // 每步的持续时间
    const pauseDuration = 500; // 在终点停顿的时间
    const fadeDuration = 300; // 淡出的时间

    let timer: NodeJS.Timeout;
    let isAnimating = true;

    const animate = () => {
      setStep((prev) => {
        const next = prev + 1;
        if (next >= positions.length) {
          // 到达终点，清除定时器并执行停顿、淡出、重置流程
          clearInterval(timer);
          isAnimating = false;

          // 停顿一下
          setTimeout(() => {
            // 开始淡出
            setOpacity(0);
            // 淡出后重置到起点
            setTimeout(() => {
              setStep(0);
              // 在左边淡入
              setTimeout(() => {
                setOpacity(1);
                // 重新开始动画
                if (!isAnimating) {
                  isAnimating = true;
                  timer = setInterval(animate, stepDuration);
                }
              }, 200);
            }, fadeDuration);
          }, pauseDuration);

          return prev; // 保持在最后一帧
        }
        return next;
      });
    };

    timer = setInterval(animate, stepDuration);

    return () => {
      clearInterval(timer);
      isAnimating = false;
    };
  }, [positions.length]);

  return (
    <div ref={containerRef} className={`${styles.container} ${className || ''}`}>
      {/* 月亮 - 沿弧线运动 */}
      <animated.img
        src={moonImage}
        alt="moon"
        className={styles.moon}
        style={{
          left: moonAnimation.x.to((x) => `${x}%`),
          transform: moonAnimation.y.to((y) => `translateY(${y}px)`),
          opacity: moonAnimation.opacity,
        }}
      />
      {/* 编程的人 */}
      <img ref={codingManRef} src={codingManImage} alt="coding man" className={styles.codingMan} />
    </div>
  );
};

export default CodingManAndMoon;
