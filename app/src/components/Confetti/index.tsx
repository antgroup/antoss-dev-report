import { useImperativeHandle, forwardRef, useRef } from 'react';
import confetti from 'canvas-confetti';

export interface ConfettiRef {
  fire: () => void;
  stop: () => void;
}

export type ConfettiType = 'default' | 'snow' | 'school-pride';

export interface ConfettiProps {
  type?: ConfettiType;
  reduced?: boolean; // 是否减少粒子数量（用于移动端性能优化）
}

function randomInRange(min: number, max: number) {
  return Math.random() * (max - min) + min;
}

// canvas-confetti 的默认颜色配置
const DEFAULT_COLORS = [
  '#26ccff',
  '#a25afd',
  '#ff5e7e',
  '#88ff5a',
  '#fcff42',
  '#ffa62d',
  '#ff36ff',
];

function getRandomColor(): string {
  return DEFAULT_COLORS[Math.floor(Math.random() * DEFAULT_COLORS.length)];
}

const Confetti = forwardRef<ConfettiRef, ConfettiProps>(function Confetti(
  { type = 'default', reduced = false },
  ref,
) {
  const snowAnimationFrameRef = useRef<number | null>(null);
  const isSnowRunningRef = useRef(false);
  const snowFrameCountRef = useRef(0);

  const stop: ConfettiRef['stop'] = () => {
    isSnowRunningRef.current = false;
    snowFrameCountRef.current = 0;
    if (snowAnimationFrameRef.current !== null) {
      cancelAnimationFrame(snowAnimationFrameRef.current);
      snowAnimationFrameRef.current = null;
    }
  };

  const fire: ConfettiRef['fire'] = () => {
    if (type === 'snow') {
      isSnowRunningRef.current = true;
      let skew = 1;
      // 移动端每5帧生成一次粒子，桌面端每帧生成
      const frameSkip = reduced ? 5 : 1;

      (function frame() {
        if (!isSnowRunningRef.current) {
          return;
        }
        snowFrameCountRef.current += 1;
        skew = Math.max(0.8, skew - 0.001);
        
        // 只在指定帧数时生成粒子
        if (snowFrameCountRef.current % frameSkip === 0) {
          confetti({
            particleCount: 1,
            startVelocity: 0,
            ticks: 200,
            origin: {
              x: Math.random(),
              // since particles fall down, skew start toward the top
              y: Math.random() * skew - 0.2,
            },
            shapes: ['circle'],
            colors: [getRandomColor()],
            gravity: randomInRange(0.4, 0.6),
            scalar: randomInRange(0.4, 1),
            drift: randomInRange(-0.4, 0.4),
          });
        }
        
        if (isSnowRunningRef.current) {
          snowAnimationFrameRef.current = requestAnimationFrame(frame);
        }
      })();
    } else if (type === 'school-pride') {
      const end = Date.now() + 7 * 1000;

      (function frame() {
        confetti({
          particleCount: 2,
          angle: 60,
          spread: 55,
          origin: { x: 0 },
          colors: [getRandomColor()],
        });
        confetti({
          particleCount: 2,
          angle: 120,
          spread: 55,
          origin: { x: 1 },
          colors: [getRandomColor()],
        });
        if (Date.now() < end) {
          requestAnimationFrame(frame);
        }
      })();
    } else {
      // default type
      confetti({
        particleCount: 200,
        spread: 100,
        origin: { y: 0.6 },
      });
    }
  };

  useImperativeHandle(ref, () => ({
    fire,
    stop,
  }));

  return null;
});

export default Confetti;
