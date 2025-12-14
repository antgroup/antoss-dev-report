import React, { useState, useEffect, useCallback, useRef } from 'react';

import styles from './index.module.scss';
import yesButton from './yes-button.png';
import loveHeart from './love-heart.svg';

interface Heart {
  id: number;
  left: number; // 相对于按钮的左侧偏移百分比
  offsetX: number; // 随机水平偏移量，用于左右摆动
}

const BubblingLoveHeart: React.FC = () => {
  const [hearts, setHearts] = useState<Heart[]>([]);
  const heartIdCounterRef = useRef(0);
  const timeoutsRef = useRef<Map<number, NodeJS.Timeout>>(new Map());

  // 创建一个新的爱心
  const createHeart = useCallback(() => {
    const heartId = heartIdCounterRef.current++;
    const newHeart: Heart = {
      id: heartId,
      left: 20 + Math.random() * 70, // 20% 到 90% 的随机位置，稍微超出按钮左右边界
      offsetX: (Math.random() - 0.5) * 60, // -30px 到 +30px 的随机偏移
    };
    setHearts((prev) => [...prev, newHeart]);

    // 3秒后移除这个爱心（动画结束后）
    const timeoutId = setTimeout(() => {
      setHearts((prev) => {
        // 使用函数式更新确保移除正确的爱心
        const filtered = prev.filter((heart) => heart.id !== heartId);
        return filtered;
      });
      // 从 Map 中移除这个 timeout
      timeoutsRef.current.delete(heartId);
    }, 3000);
    timeoutsRef.current.set(heartId, timeoutId);
  }, []);

  // 持续冒泡效果
  useEffect(() => {
    const timeouts = timeoutsRef.current;
    const interval = setInterval(() => {
      createHeart();
    }, 500); // 每0.5秒冒出一个爱心

    return () => {
      clearInterval(interval);
      // 清理所有未完成的 timeout
      timeouts.forEach((timeoutId) => {
        clearTimeout(timeoutId);
      });
      timeouts.clear();
      // 清空所有爱心
      setHearts([]);
    };
  }, [createHeart]);

  // 点击按钮时触发冒泡
  const handleButtonClick = useCallback(() => {
    createHeart();
  }, [createHeart]);

  return (
    <div className={styles.bubblingLoveHeart}>
      <div className={styles.buttonContainer}>
        <button className={styles.yesButton} onClick={handleButtonClick}>
          <img src={yesButton} alt="yes" />
        </button>
        {hearts.map((heart) => {
          const style: React.CSSProperties & Record<string, string> = {
            left: `${heart.left}%`,
            '--offset-x': `${heart.offsetX}px`,
          };

          return (
            <div key={heart.id} className={styles.heart} style={style}>
              <img src={loveHeart} alt="love heart" />
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default BubblingLoveHeart;
