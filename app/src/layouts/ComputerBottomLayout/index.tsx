import React, { useEffect, useRef, useState } from 'react';
import BaseLayout, { BaseLayoutProps } from '@/layouts/BaseLayout';
import RetroComputer from '@/components/RetroComputer';
import PageWithBar from './PageWithBar';

import styles from './index.module.scss';

interface ComputerBottomLayoutProps extends Omit<BaseLayoutProps, 'children'> {
  topContent?: React.ReactNode;
  paperContent: React.ReactNode;
}

const ComputerBottomLayout: React.FC<ComputerBottomLayoutProps> = ({
  topContent = null,
  paperContent,
  ...baseLayoutProps
}) => {
  const paperRef = useRef<HTMLDivElement>(null);
  const computerRef = useRef<HTMLDivElement>(null);
  const [paperStyle, setPaperStyle] = useState<React.CSSProperties>({});

  // 计算纸的位置
  useEffect(() => {
    const updatePaperPosition = () => {
      if (!paperRef.current) return;

      // 在当前布局的电脑容器内查找 paperSlot 元素，使用 data 属性避免 id 冲突
      if (!computerRef.current) return;
      const paperSlotElement = computerRef.current.querySelector(
        '[data-paper-slot]',
      ) as HTMLElement;
      if (!paperSlotElement) return;

      // 获取"吐纸条"元素的位置和尺寸
      const paperSlotRect = paperSlotElement.getBoundingClientRect();
      const paperSlotWidth = paperSlotRect.width;
      const paperSlotHeight = paperSlotRect.height;
      const paperSlotX = paperSlotRect.left;
      const paperSlotY = paperSlotRect.top;

      // 获取纸 div 的父容器位置
      const contentContainer = paperRef.current.closest('[class*="content"]');
      if (!contentContainer) return;
      const contentRect = (contentContainer as HTMLElement).getBoundingClientRect();

      // 计算纸的宽度（96% 的 rect 宽度）
      const paperWidth = paperSlotWidth * 0.96;

      // 计算纸相对于 content 容器的位置
      const paperLeft = paperSlotX - contentRect.left + (paperSlotWidth - paperWidth) / 2;

      const paperSlotCenterY = paperSlotY + 0.5 * paperSlotHeight;
      const paperBottomY = paperRef.current.offsetTop + paperRef.current.offsetHeight;
      const translateY = paperSlotCenterY - paperBottomY - contentRect.top;

      setPaperStyle({
        width: `${paperSlotWidth * 0.96}px`,
        transform: `translateX(${paperLeft}px) translateY(${translateY}px)`,
      });
    };

    // 初始计算，延迟一下确保 DOM 已渲染
    const rafId = requestAnimationFrame(() => {
      setTimeout(updatePaperPosition, 0);
    });

    // 监听窗口大小变化
    window.addEventListener('resize', updatePaperPosition);

    // 使用 ResizeObserver 监听相关元素尺寸变化
    const resizeObserver = new ResizeObserver(() => {
      requestAnimationFrame(updatePaperPosition);
    });

    if (paperRef.current) {
      resizeObserver.observe(paperRef.current);
    }

    // 监听 paperSlot 元素的变化
    if (computerRef.current) {
      const paperSlotElement = computerRef.current.querySelector(
        '[data-paper-slot]',
      ) as HTMLElement;
      if (paperSlotElement) {
        resizeObserver.observe(paperSlotElement);
      }
    }

    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener('resize', updatePaperPosition);
      resizeObserver.disconnect();
    };
  }, []);

  return (
    <BaseLayout {...baseLayoutProps}>
      {topContent}
      {/* 纸 */}
      <PageWithBar ref={paperRef} className={styles.paper} style={paperStyle}>
        {paperContent}
      </PageWithBar>
      {/* 电脑 */}
      <div ref={computerRef} className={styles.retroComputer}>
        <RetroComputer variant="printer" onlyDesk />
      </div>
    </BaseLayout>
  );
};

export default ComputerBottomLayout;
