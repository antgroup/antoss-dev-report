import { useEffect, useRef, useMemo, forwardRef, useImperativeHandle, useCallback } from 'react';
import { gsap } from 'gsap';
import styles from './index.module.scss';

interface AnimatedContributionGraphProps {
  contributionDays: number;
  duration?: number; // 动画总时长（秒）
  className?: string;
}

export interface AnimatedContributionGraphRef {
  play: () => void;
}

// GitHub 贡献图的绿色配色（从浅到深）
const GITHUB_GREENS = [
  '#ebedf0', // 无贡献（灰色）
  '#9be9a8', // 1级（最浅绿）
  '#40c463', // 2级
  '#30a14e', // 3级
  '#216e39', // 4级（最深绿）
];

const AnimatedContributionGraph = forwardRef<
  AnimatedContributionGraphRef,
  AnimatedContributionGraphProps
>(({ contributionDays, duration = 3, className = '' }, ref) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);
  const cellRefs = useRef<Array<HTMLDivElement | null>>([]);
  const timelineRef = useRef<gsap.core.Timeline | null>(null);

  // 计算网格尺寸：长宽比约2:1，总格子数接近365
  // 28列 x 13行 = 364个格子
  const COLS = 28;
  const ROWS = 13;
  const TOTAL_CELLS = COLS * ROWS;

  // 生成所有格子的索引，并随机选择要点亮的格子
  const activeCellIndices = useMemo(() => {
    const allIndices = Array.from({ length: TOTAL_CELLS }, (_, i) => i);
    // 随机打乱
    const shuffled = [...allIndices].sort(() => Math.random() - 0.5);
    // 选择前 contributionDays 个（但不超过总数）
    const count = Math.min(contributionDays, TOTAL_CELLS);
    // 保持随机顺序，不排序，用于随机点亮效果
    return shuffled.slice(0, count);
  }, [contributionDays, TOTAL_CELLS]);

  // 为每个格子随机分配绿色等级（1-4级，不包括灰色）
  const cellColors = useMemo(() => {
    const colors: string[] = [];
    for (let i = 0; i < TOTAL_CELLS; i++) {
      if (activeCellIndices.includes(i)) {
        // 随机选择1-4级的绿色（不包括灰色）
        const level = Math.floor(Math.random() * 4) + 1;
        colors[i] = GITHUB_GREENS[level];
      } else {
        // 无贡献的格子使用灰色
        colors[i] = GITHUB_GREENS[0];
      }
    }
    return colors;
  }, [activeCellIndices, TOTAL_CELLS]);

  // 初始化格子状态 - 所有格子初始都是灰色
  useEffect(() => {
    const cells = cellRefs.current.filter(Boolean) as HTMLDivElement[];
    if (cells.length === 0) return;

    // 初始化所有格子为灰色且半透明
    cells.forEach((cell) => {
      gsap.set(cell, {
        backgroundColor: GITHUB_GREENS[0],
        opacity: 0.4,
        scale: 0.9,
      });
    });
  }, []);

  // 播放动画的方法
  const play = useCallback(() => {
    if (!gridRef.current || activeCellIndices.length === 0) return;

    const cells = cellRefs.current.filter(Boolean) as HTMLDivElement[];
    if (cells.length === 0) return;

    // 清理之前的动画
    if (timelineRef.current) {
      timelineRef.current.kill();
    }

    // 创建时间线
    const tl = gsap.timeline();
    timelineRef.current = tl;

    // 将要点亮的格子再次随机打乱，实现完全随机的点亮顺序（像大楼住户开灯）
    const shuffledActiveIndices = [...activeCellIndices].sort(() => Math.random() - 0.5);

    // 随机顺序点亮格子，像大楼不同住户开灯的效果，瞬间点亮
    shuffledActiveIndices.forEach((cellIndex) => {
      const cell = cells[cellIndex];
      if (!cell) return;

      const targetColor = cellColors[cellIndex];
      // 每个格子随机分配时间点，让点亮效果更随机
      const randomDelay = Math.random() * duration;

      tl.set(
        cell,
        {
          backgroundColor: targetColor,
          opacity: 1,
          scale: 1,
        },
        randomDelay,
      );
    });
  }, [activeCellIndices, cellColors, duration]);

  // 暴露 play 方法给父组件
  useImperativeHandle(ref, () => ({
    play,
  }));

  // 清理动画
  useEffect(() => {
    return () => {
      if (timelineRef.current) {
        timelineRef.current.kill();
      }
    };
  }, []);

  return (
    <div ref={containerRef} className={`${styles.container} ${className}`}>
      <div ref={gridRef} className={styles.grid}>
        {Array.from({ length: TOTAL_CELLS }, (_, index) => (
          <div
            key={index}
            ref={(el) => {
              cellRefs.current[index] = el;
            }}
            className={styles.cell}
            style={{
              backgroundColor: GITHUB_GREENS[0], // 初始都是灰色，只在play()时才点亮
            }}
          />
        ))}
      </div>
    </div>
  );
});

AnimatedContributionGraph.displayName = 'AnimatedContributionGraph';

export default AnimatedContributionGraph;
