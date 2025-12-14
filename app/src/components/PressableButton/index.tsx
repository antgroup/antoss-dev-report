import React, { forwardRef, useEffect, useImperativeHandle, useRef, useState } from 'react';

import styles from './index.module.scss';

interface PressableButtonProps {
  children?: React.ReactNode;
  onClick?: () => void;
  className?: string;
  disabled?: boolean;
  // 支持传入两张图片，根据 pressed 状态切换
  normalImage?: string;
  pressedImage?: string;
  imageAlt?: string;
}

export interface PressableButtonRef {
  pressDown: () => void;
  pressUp: () => void;
}

const PressableButton = forwardRef<PressableButtonRef, PressableButtonProps>(
  (
    {
      children,
      onClick,
      className = '',
      disabled = false,
      normalImage,
      pressedImage,
      imageAlt = '',
    },
    ref,
  ) => {
    const [pressed, setPressed] = useState(false);
    const pressDown = useRef(false);
    const handlePressUpRef = useRef<(event?: Event) => void>();
    const globalHandlerRef = useRef<((event: Event) => void) | null>(null);
    const buttonRef = useRef<HTMLDivElement>(null);

    const handlePressUp = (event?: Event) => {
      if (pressDown.current) {
        pressDown.current = false;
        setPressed(false);
        // 移除全局事件监听
        const handler = globalHandlerRef.current;
        if (handler) {
          document.removeEventListener('mouseup', handler);
          document.removeEventListener('touchend', handler);
          globalHandlerRef.current = null;
        }
        // 检查是否在按钮内释放
        const isInsideButton =
          !event ||
          (buttonRef.current &&
            (buttonRef.current.contains(event.target as Node) ||
              event.target === buttonRef.current));
        if (isInsideButton && onClick && !disabled) {
          onClick();
        }
      }
    };

    // 更新 ref 以保持最新的函数引用
    handlePressUpRef.current = handlePressUp;

    const handlePressDown = (e: React.MouseEvent | React.TouchEvent) => {
      if (disabled) return;
      e.preventDefault(); // 防止默认行为（包括右键菜单和点击高亮）
      pressDown.current = true;
      setPressed(true);
      // 添加全局事件监听，以便在按钮外释放也能触发
      const handler = (event: Event) => {
        const pressUpHandler = handlePressUpRef.current;
        if (pressUpHandler) {
          pressUpHandler(event);
        }
      };
      globalHandlerRef.current = handler;
      document.addEventListener('mouseup', handler);
      document.addEventListener('touchend', handler);
    };

    // 暴露给外部的方法
    useImperativeHandle(ref, () => ({
      pressDown: () => {
        if (disabled) return;
        pressDown.current = true;
        setPressed(true);
      },
      pressUp: () => {
        if (pressDown.current) {
          pressDown.current = false;
          setPressed(false);
          if (onClick && !disabled) {
            onClick();
          }
        }
      },
    }));

    // 组件卸载时清理事件监听
    useEffect(() => {
      return () => {
        const handler = globalHandlerRef.current;
        if (handler) {
          document.removeEventListener('mouseup', handler);
          document.removeEventListener('touchend', handler);
          globalHandlerRef.current = null;
        }
      };
    }, []);

    // 如果提供了图片，使用图片切换模式，否则使用原来的 children 模式
    const useImageMode = normalImage && pressedImage;
    const currentImage = pressed ? pressedImage : normalImage;

    return (
      <div
        ref={buttonRef}
        className={`${styles.button} ${!useImageMode && pressed ? styles.pressed : ''} ${disabled ? styles.disabled : ''} ${className}`}
        data-pressed={pressed}
        onMouseDown={handlePressDown}
        onMouseUp={(e) => {
          e.preventDefault();
          handlePressUp();
        }}
        onTouchStart={handlePressDown}
        onTouchEnd={(e) => {
          e.preventDefault();
          handlePressUp();
        }}
        onContextMenu={(e) => e.preventDefault()} // 防止右键菜单
      >
        {useImageMode && currentImage ? <img src={currentImage} alt={imageAlt} /> : children}
      </div>
    );
  },
);

PressableButton.displayName = 'PressableButton';

export default PressableButton;
