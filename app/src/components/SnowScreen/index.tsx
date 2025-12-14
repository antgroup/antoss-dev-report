import React, { useRef, useEffect, useState, useCallback } from 'react';

export interface SnowScreenProps {
  /** 要显示的文本，如果不提供则不显示文本 */
  text?: string;
  /** 文本字体大小，相对于容器宽度的比例，默认为 0.36 */
  textFontSizeRatio?: number;
  /** 文本字体族，默认为 'fantasy, monospace' */
  textFontFamily?: string;
  /** 动画速度，控制滚动条纹的速度，默认为 10 */
  scrollSpeed?: number;
  /** 文本透明度最大值，默认为 0.35 */
  textAlphaMax?: number;
  /** 文本透明度变化速度，默认为 0.005 */
  textAlphaSpeed?: number;
  /** 背景噪声强度，控制随机灰度的范围，默认为 50-255 */
  noiseIntensity?: {
    min?: number;
    max?: number;
  };
  /** 条纹透明度，默认为 0.02 */
  stripeAlpha?: number;
  /** 条纹阴影模糊度，默认为 20 */
  shadowBlur?: number;
}

const SnowScreen: React.FC<SnowScreenProps> = ({
  text,
  textFontSizeRatio = 0.36,
  textFontFamily = '',
  scrollSpeed = 10,
  textAlphaMax = 0.35,
  textAlphaSpeed = 0.005,
  noiseIntensity = { min: 50, max: 255 },
  stripeAlpha = 0.02,
  shadowBlur = 20,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [context, setContext] = useState<CanvasRenderingContext2D | null>(null);
  const [width, setWidth] = useState<number>(0);
  const [height, setHeight] = useState<number>(0);

  // 动画状态
  const offsetRef = useRef<number>(0);
  const imgDataRef = useRef<ImageData | null>(null);
  const alphaRef = useRef<number>(0);
  const alphaNumRef = useRef<number>(textAlphaSpeed);
  const animationFrameIdRef = useRef<number | null>(null);
  const lastTimeRef = useRef<number>(0);

  // 生成背景图像数据
  const changeImgData = useCallback((ctx: CanvasRenderingContext2D, w: number, h: number) => {
    // 确保宽度和高度都大于 0
    if (w <= 0 || h <= 0) {
      imgDataRef.current = null;
      return;
    }
    // getImageData 和 putImageData 使用实际像素坐标，不受 scale 影响
    // 所以需要使用 Canvas 的实际像素尺寸
    const { canvas } = ctx;
    const actualWidth = canvas.width;
    const actualHeight = canvas.height;

    // 先填充白色背景
    ctx.fillStyle = 'white';
    ctx.fillRect(0, 0, w, h);
    ctx.fill();

    // 获取实际像素尺寸的图像数据
    imgDataRef.current = ctx.getImageData(0, 0, actualWidth, actualHeight);
  }, []);

  // 调整 Canvas 尺寸
  const resizeCanvas = useCallback(
    (ctx: CanvasRenderingContext2D) => {
      const { canvas } = ctx;
      const { width: rectWidth, height: rectHeight } = canvas.getBoundingClientRect();

      // 确保尺寸有效
      if (rectWidth <= 0 || rectHeight <= 0) {
        return false;
      }

      const { devicePixelRatio: ratio = 1 } = window;
      const actualWidth = rectWidth * ratio;
      const actualHeight = rectHeight * ratio;

      if (canvas.width !== actualWidth || canvas.height !== actualHeight) {
        canvas.width = actualWidth;
        canvas.height = actualHeight;
        ctx.scale(ratio, ratio);
        setWidth(rectWidth);
        setHeight(rectHeight);
        // 尺寸改变时重新生成背景图像数据（使用逻辑尺寸，因为已经 scale 过了）
        changeImgData(ctx, rectWidth, rectHeight);
        return true;
      }
      return false;
    },
    [changeImgData],
  );

  // 绘制背景（随机灰度噪声）
  const drawBackground = useCallback(
    (ctx: CanvasRenderingContext2D, imgData: ImageData) => {
      const min = noiseIntensity.min ?? 50;
      const max = noiseIntensity.max ?? 255;
      const { data } = imgData;
      for (let i = 0; i < data.length; i += 4) {
        const color = Math.floor(Math.random() * (max - min + 1)) + min;
        data[i] = color; // R
        data[i + 1] = color; // G
        data[i + 2] = color; // B
        // data[i + 3] 保持原有的 alpha 值
      }
      // putImageData 使用实际像素坐标，不受 scale 影响
      ctx.putImageData(imgData, 0, 0);
    },
    [noiseIntensity],
  );

  // 绘制滚动条纹
  const drawFrame = useCallback(
    (ctx: CanvasRenderingContext2D, w: number, h: number, currentTime: number) => {
      offsetRef.current = currentTime / scrollSpeed;
      const v = h / 5;

      for (let y = -h / 5; y < h; y += v) {
        const alpha = (textAlphaMax - alphaRef.current) / 8 + stripeAlpha;
        ctx.fillStyle = `rgba(0, 0, 0, ${alpha})`;
        ctx.shadowColor = 'black';
        ctx.shadowBlur = shadowBlur;
        ctx.fillRect(0, y + (offsetRef.current % v), w, v / 2);
      }
    },
    [scrollSpeed, textAlphaMax, stripeAlpha, shadowBlur],
  );

  // 绘制文本
  const drawText = useCallback(
    (ctx: CanvasRenderingContext2D, w: number, h: number) => {
      if (!text) return;

      // 更新透明度
      alphaRef.current += alphaNumRef.current;
      if (alphaRef.current >= textAlphaMax) {
        alphaRef.current = textAlphaMax;
        alphaNumRef.current *= -1;
      } else if (alphaRef.current < 0) {
        alphaRef.current = 0;
        alphaNumRef.current *= -1;
      }

      const fontSize = w * textFontSizeRatio;
      ctx.save();
      ctx.fillStyle = `rgba(0, 0, 0, ${alphaRef.current})`;
      ctx.font = `bold ${fontSize}px ${textFontFamily}`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.shadowColor = 'black';
      ctx.shadowBlur = shadowBlur;
      ctx.fillText(text, w / 2, h / 2);
      ctx.restore();
    },
    [text, textFontSizeRatio, textFontFamily, textAlphaMax, shadowBlur],
  );

  // 初始化 Canvas
  useEffect(() => {
    if (canvasRef.current) {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        setContext(ctx);
        resizeCanvas(ctx);

        // 监听容器尺寸变化
        const resizeObserver = new ResizeObserver(() => {
          resizeCanvas(ctx);
        });
        resizeObserver.observe(canvas);

        return () => {
          resizeObserver.disconnect();
        };
      }
    } else {
      setContext(null);
    }
  }, [resizeCanvas]);

  // 动画循环
  useEffect(() => {
    if (!context || width === 0 || height === 0) return;

    const step = (currentTime: number) => {
      lastTimeRef.current = currentTime;

      context.clearRect(0, 0, width, height);

      if (imgDataRef.current) {
        drawBackground(context, imgDataRef.current);
      }
      drawText(context, width, height);
      drawFrame(context, width, height, currentTime);

      animationFrameIdRef.current = requestAnimationFrame(step);
    };

    lastTimeRef.current = performance.now();
    animationFrameIdRef.current = requestAnimationFrame(step);

    return () => {
      if (animationFrameIdRef.current !== null) {
        cancelAnimationFrame(animationFrameIdRef.current);
      }
    };
  }, [context, width, height, drawBackground, drawText, drawFrame]);

  return (
    <canvas
      ref={canvasRef}
      style={{
        width: '100%',
        height: '100%',
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: 1,
      }}
    />
  );
};

export default SnowScreen;
