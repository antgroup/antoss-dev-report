import React, { useRef, useEffect, useState, useCallback } from 'react';

export interface MatrixRainProps {
  /** 主题，light 或 dark，默认为 'light' */
  theme?: 'light' | 'dark';
  /** 背景色，默认为透明（light主题）或渐变（dark主题） */
  backgroundColor?: string;
  /** 密度，控制垂直方向数字串的密集程度，数值越大数字串之间的间距越小，雨越密集，默认为 1 */
  density?: number;
  /** 速度，fps 帧率，默认为 20 */
  speed?: number;
  /** 字符串最小长度，默认为 10 */
  minStringLength?: number;
  /** 字符串最大长度，默认为 15 */
  maxStringLength?: number;
  /** 字体大小，默认为 12 */
  fontSize?: number;
  /** 字体族，默认为 '04b_03' */
  fontFamily?: string;
}

interface CanvasProps {
  draw: () => void;
  fps?: number;
  establishContext?: (context: CanvasRenderingContext2D) => void;
  establishCanvasWidth?: (width: number) => void;
  width?: string | number;
  height?: string | number;
  backgroundColor?: string;
  backgroundImage?: string;
}

const Canvas: React.FC<CanvasProps> = ({
  draw,
  fps = 20,
  establishContext,
  establishCanvasWidth,
  width = '100%',
  height = '100%',
  backgroundColor = 'transparent',
  backgroundImage,
  ...rest
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [context, setContext] = useState<CanvasRenderingContext2D | null>(null);

  const resizeCanvas = useCallback(
    (ctx: CanvasRenderingContext2D) => {
      const { canvas } = ctx;
      const { width: rectWidth, height: rectHeight } = canvas.getBoundingClientRect();

      if (canvas.width !== rectWidth || canvas.height !== rectHeight) {
        const { devicePixelRatio: ratio = 1 } = window;
        canvas.width = rectWidth * ratio;
        canvas.height = rectHeight * ratio;
        if (establishCanvasWidth) {
          // 传递逻辑宽度（CSS 宽度），而不是像素宽度
          establishCanvasWidth(rectWidth);
        }
        ctx.scale(ratio, ratio);
        return true;
      }
      return false;
    },
    [establishCanvasWidth],
  );

  useEffect(() => {
    if (canvasRef.current) {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        setContext(ctx);
        resizeCanvas(ctx);
        if (establishContext) {
          establishContext(ctx);
        }

        // 监听容器尺寸变化，确保 Canvas 尺寸始终正确
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
  }, [establishContext, resizeCanvas]);

  useEffect(() => {
    let animationFrameId: number;
    let fpsInterval: number;
    let then: number;
    let now: number;
    let elapsed: number;

    if (context) {
      const render = () => {
        animationFrameId = window.requestAnimationFrame(render);
        now = Date.now();
        elapsed = now - then;

        if (elapsed > fpsInterval) {
          then = now - (elapsed % fpsInterval);
          draw();
        }
      };

      const startRendering = (targetFps: number) => {
        fpsInterval = 1000 / targetFps;
        then = Date.now();
        render();
      };

      startRendering(fps);
    }

    return () => {
      if (animationFrameId) {
        window.cancelAnimationFrame(animationFrameId);
      }
    };
  }, [draw, context, fps]);

  return (
    <canvas
      ref={canvasRef}
      {...rest}
      style={{
        backgroundColor,
        backgroundImage,
        width,
        height,
        position: 'absolute',
        top: 0,
        left: 0,
      }}
    />
  );
};

// 计算实际的 fontSize（将设计稿的 px 值转换为实际的 px 值）
// 设计稿宽度 750px，rootValue 75，所以设计稿 px / 75 = rem，然后 rem * 当前1rem的px值 = 实际px
const getActualFontSize = (designPx: number): number => {
  const rootValue = 75; // 与 vite.config.ts 中的 rootValue 保持一致
  const remValue = designPx / rootValue;
  const currentRemPx = parseFloat(getComputedStyle(document.documentElement).fontSize) || 37.5;
  return remValue * currentRemPx;
};

const MatrixRain: React.FC<MatrixRainProps> = ({
  theme = 'light',
  backgroundColor,
  density = 1,
  speed = 10,
  minStringLength = 10,
  maxStringLength = 15,
  fontSize = 40,
  fontFamily = '04b_03',
}) => {
  // 根据主题设置默认背景
  const finalBackgroundColor =
    backgroundColor || (theme === 'dark' ? 'transparent' : 'transparent');
  const finalBackgroundImage =
    theme === 'dark' ? 'linear-gradient(190deg, #131313 6%, #616161 53%, #404040 97%)' : undefined;
  // 根据主题设置字符颜色：dark 主题下使用蓝色 #1677ff，配合 50% 透明度
  const textColor = theme === 'dark' ? '#1677ff' : 'rgb(175, 175, 175)';
  // dark 主题下，最深颜色为 50% 透明度
  const maxAlphaMultiplier = theme === 'dark' ? 0.5 : 1;
  const [ctx, setCtx] = useState<CanvasRenderingContext2D | null>(null);
  const [canvasWidth, setCanvasWidth] = useState<number>(0);
  const [fontLoaded, setFontLoaded] = useState<boolean>(false);
  // 实际的 fontSize（响应式，会根据 rem 基准值变化）
  const [actualFontSize, setActualFontSize] = useState<number>(() => getActualFontSize(fontSize));
  // 每列可以有多个数字串，dropsRef.current[i] 是第 i 列所有数字串的位置数组
  const dropsRef = useRef<number[][]>([]);
  const stringsRef = useRef<string[][]>([]);
  // 每个字符串的颜色亮度系数（0.3-1.0），1.0 表示最深的颜色（textColor）
  const colorBrightnessRef = useRef<number[][]>([]);
  // 每个字符串的字体大小系数（0.6-1.0），用于模拟远近效果
  const fontSizeScaleRef = useRef<number[][]>([]);

  const establishContext = useCallback((context: CanvasRenderingContext2D) => {
    setCtx(context);
  }, []);

  const establishCanvasWidth = useCallback((width: number) => {
    setCanvasWidth(width);
  }, []);

  // 检查并等待字体加载完成
  useEffect(() => {
    const checkFontLoaded = async () => {
      // 检查字体是否已经加载
      if (document.fonts.check(`1em "${fontFamily}"`)) {
        setFontLoaded(true);
        return;
      }

      // 如果字体未加载，等待字体加载完成
      try {
        await document.fonts.ready;
        // 再次检查字体是否可用
        if (document.fonts.check(`1em "${fontFamily}"`)) {
          setFontLoaded(true);
        } else {
          // 如果字体仍然不可用，等待一段时间后重试
          setTimeout(() => {
            if (document.fonts.check(`1em "${fontFamily}"`)) {
              setFontLoaded(true);
            } else {
              // 如果字体仍然不可用，也设置为 true，让 Canvas 使用回退字体
              setFontLoaded(true);
            }
          }, 100);
        }
      } catch (error) {
        // 如果出错，也设置为 true，让 Canvas 使用回退字体
        setFontLoaded(true);
      }
    };

    checkFontLoaded();
  }, [fontFamily]);

  // 监听窗口大小变化，更新实际的 fontSize（因为 rem 基准值会变化）
  useEffect(() => {
    const updateFontSize = () => {
      setActualFontSize(getActualFontSize(fontSize));
    };

    // 初始更新
    updateFontSize();

    // 监听窗口大小变化（rem 基准值会在 window.onresize 时更新）
    window.addEventListener('resize', updateFontSize);

    return () => {
      window.removeEventListener('resize', updateFontSize);
    };
  }, [fontSize]);

  // 生成随机长度的 0 和 1 字符串，避免连续出现相同的字符，使分布更随机错乱
  const generateBinaryString = useCallback((minLen: number, maxLen: number): string => {
    const length = Math.floor(Math.random() * (maxLen - minLen + 1)) + minLen;
    let str = '';

    for (let i = 0; i < length; i++) {
      let char: string;

      if (i === 0) {
        // 第一个字符随机
        char = Math.random() > 0.5 ? '1' : '0';
      } else {
        const lastChar = str[i - 1];
        // 检查前一个字符，如果前一个和前前一个相同，则强制生成不同的字符
        if (i > 1 && str[i - 2] === lastChar) {
          // 已经连续两个相同，强制生成不同的字符
          char = lastChar === '0' ? '1' : '0';
        } else if (Math.random() < 0.85) {
          // 85% 概率生成与前一个不同的字符
          char = lastChar === '0' ? '1' : '0';
        } else {
          // 15% 概率可能相同（但最多连续 2 个）
          char = lastChar;
        }
      }

      str += char;
    }

    return str;
  }, []);

  // 将颜色转换为带透明度的 rgba 格式，并应用亮度系数
  const getColorWithAlpha = useCallback(
    (color: string, alpha: number, brightness = 1): string => {
      // 先应用亮度系数和主题透明度系数，再应用透明度
      const finalAlpha = alpha * brightness * maxAlphaMultiplier;

    if (color.startsWith('#')) {
      // 十六进制颜色
      const r = parseInt(color.slice(1, 3), 16);
      const g = parseInt(color.slice(3, 5), 16);
      const b = parseInt(color.slice(5, 7), 16);
      return `rgba(${r}, ${g}, ${b}, ${finalAlpha})`;
    } else if (color.startsWith('rgb(')) {
      // rgb 颜色
      const match = color.match(/rgb\((\d+),\s*(\d+),\s*(\d+)\)/);
      if (match) {
        const r = parseInt(match[1], 10);
        const g = parseInt(match[2], 10);
        const b = parseInt(match[3], 10);
        return `rgba(${r}, ${g}, ${b}, ${finalAlpha})`;
      }
      return color.replace('rgb(', 'rgba(').replace(')', `, ${finalAlpha})`);
    } else if (color.startsWith('rgba(')) {
      // rgba 颜色，替换 alpha 值
      return color.replace(/,\s*[\d.]+\)$/, `, ${finalAlpha})`);
    }
    // 其他格式，直接返回
    return color;
    },
    [maxAlphaMultiplier],
  );

  // 初始化 drops 数组和字符串数组
  useEffect(() => {
    if (canvasWidth > 0 && ctx) {
      const columns = Math.floor(canvasWidth / actualFontSize);
      const maxRows = Math.floor((ctx.canvas.height || 0) / actualFontSize);

      dropsRef.current = new Array(columns);
      stringsRef.current = new Array(columns);
      colorBrightnessRef.current = new Array(columns);
      fontSizeScaleRef.current = new Array(columns);

      // 初始化每列，每列可以有多个数字串
      for (let i = 0; i < columns; i++) {
        dropsRef.current[i] = [];
        stringsRef.current[i] = [];
        colorBrightnessRef.current[i] = [];
        fontSizeScaleRef.current[i] = [];

        // 根据 density 计算数字串之间的最小间距（以行数为单位）
        // density 越大，间距越小，数字串越密集
        const minSpacing = Math.max(1, Math.floor(maxStringLength / density));

        // 初始化该列的第一个数字串
        let currentPosition =
          Math.random() < 0.3
            ? -Math.floor(Math.random() * maxRows * 2) // 30% 的概率从画布上方开始
            : Math.floor(Math.random() * maxRows); // 70% 的概率从画布内随机位置开始

        // 根据 density 在列中生成多个初始数字串，使雨更密集
        while (currentPosition < maxRows + maxRows) {
          dropsRef.current[i].push(currentPosition);
          stringsRef.current[i].push(generateBinaryString(minStringLength, maxStringLength));
          colorBrightnessRef.current[i].push(0.3 + Math.random() * 0.7);
          fontSizeScaleRef.current[i].push(0.7 + Math.random() * 0.3);

          // 下一个数字串的位置，间距受 density 控制
          const stringLength = stringsRef.current[i][stringsRef.current[i].length - 1].length;
          currentPosition += stringLength + minSpacing;
        }
      }
    }
  }, [
    canvasWidth,
    actualFontSize,
    density,
    ctx,
    minStringLength,
    maxStringLength,
    generateBinaryString,
  ]);

  const draw = useCallback(() => {
    if (!ctx || !fontLoaded) return;

    // 检查并更新 Canvas 尺寸，确保在容器缩放时尺寸正确
    const { width: rectWidth, height: rectHeight } = ctx.canvas.getBoundingClientRect();
    const { devicePixelRatio: ratio = 1 } = window;
    const expectedWidth = rectWidth * ratio;
    const expectedHeight = rectHeight * ratio;

    if (ctx.canvas.width !== expectedWidth || ctx.canvas.height !== expectedHeight) {
      ctx.canvas.width = expectedWidth;
      ctx.canvas.height = expectedHeight;
      ctx.scale(ratio, ratio);
      // 更新 canvasWidth，触发重新初始化（使用逻辑宽度）
      setCanvasWidth(rectWidth);
    }

    // 移除底纹栅格，不绘制半透明背景
    // 使用逻辑尺寸（CSS 尺寸）而不是像素尺寸
    ctx.clearRect(0, 0, rectWidth, rectHeight);

    const maxRows = Math.floor(rectHeight / actualFontSize);
    // 计算当前宽度应该有多少列
    const expectedColumns = Math.floor(rectWidth / actualFontSize);
    const columns = dropsRef.current.length;

    // 如果列数不匹配，说明 Canvas 尺寸改变了，需要重新初始化
    if (columns !== expectedColumns) {
      setCanvasWidth(rectWidth);
      return; // 等待重新初始化完成
    }

    // 根据 density 计算数字串之间的最小间距（以行数为单位）
    const minSpacing = Math.max(1, Math.floor(maxStringLength / density));

    for (let i = 0; i < columns; i++) {
      const columnDrops = dropsRef.current[i] || [];
      const columnStrings = stringsRef.current[i] || [];
      const columnColorBrightness = colorBrightnessRef.current[i] || [];
      const columnFontSizeScale = fontSizeScaleRef.current[i] || [];

      // 计算列的中心 x 坐标
      const columnCenterX = i * actualFontSize + actualFontSize / 2;

      // 绘制该列的所有数字串
      for (let k = 0; k < columnDrops.length; k++) {
        const currentRow = columnDrops[k];
        const binaryString =
          columnStrings[k] || generateBinaryString(minStringLength, maxStringLength);
        const colorBrightness = columnColorBrightness[k] ?? 1;
        const fontSizeScale = columnFontSizeScale[k] ?? 1;
        const currentFontSize = actualFontSize * fontSizeScale;

        // 设置当前字符串的字体大小，字体名称用引号包裹以确保正确识别
        ctx.font = `${currentFontSize}px "${fontFamily}"`;

        // 绘制字符串的每个字符（包括在画布上方和画布内的部分）
        for (let j = 0; j < binaryString.length; j++) {
          const charRow = currentRow - j;
          // 只绘制在画布可见范围内的字符
          if (charRow >= 0 && charRow < maxRows) {
            // 根据字符在字符串中的位置调整透明度，越靠前（j越小）越亮
            const alpha = 1 - (j / binaryString.length) * 0.7;
            // 应用颜色亮度系数，textColor 是最深时的颜色
            ctx.fillStyle = getColorWithAlpha(textColor, alpha, colorBrightness);

            // 测量字符宽度，使字符在列内居中
            const char = binaryString[j];
            const charWidth = ctx.measureText(char).width;
            // 计算字符的 x 坐标，使其在列中心居中
            const charX = columnCenterX - charWidth / 2;

            // 绘制字符
            ctx.fillText(char, charX, charRow * actualFontSize);
          }
        }

        // 更新位置
        columnDrops[k]++;

        // 当字符串完全离开画布底部时，从数组中移除
        if (currentRow - binaryString.length > maxRows) {
          columnDrops.splice(k, 1);
          columnStrings.splice(k, 1);
          columnColorBrightness.splice(k, 1);
          columnFontSizeScale.splice(k, 1);
          k--; // 调整索引
        }
      }

      // 检查是否需要生成新的数字串
      // 如果该列没有数字串，或者最后一个数字串的头部已经离开画布一定距离，生成新的
      if (columnDrops.length === 0) {
        // 如果列中没有数字串，生成一个从画布上方开始
        const newPosition = -Math.floor(Math.random() * maxRows * 2);
        columnDrops.push(newPosition);
        columnStrings.push(generateBinaryString(minStringLength, maxStringLength));
        columnColorBrightness.push(0.3 + Math.random() * 0.7);
        columnFontSizeScale.push(0.7 + Math.random() * 0.3);
      } else {
        // 找到该列最前面的数字串（位置最小的）
        let minPosition = columnDrops[0];
        let minIndex = 0;
        for (let k = 1; k < columnDrops.length; k++) {
          if (columnDrops[k] < minPosition) {
            minPosition = columnDrops[k];
            minIndex = k;
          }
        }

        // 如果最前面的数字串的头部已经离开画布一定距离，生成新的数字串
        // 距离由 density 控制：density 越大，距离越小，新数字串生成得越早
        const leadingStringLength = columnStrings[minIndex].length;
        const distanceFromTop = minPosition - leadingStringLength;
        if (distanceFromTop > -maxRows * 2 + minSpacing) {
          // 在画布上方生成新的数字串，位置由 density 控制
          const newPosition = minPosition - leadingStringLength - minSpacing;
          columnDrops.push(newPosition);
          columnStrings.push(generateBinaryString(minStringLength, maxStringLength));
          columnColorBrightness.push(0.3 + Math.random() * 0.7);
          columnFontSizeScale.push(0.7 + Math.random() * 0.3);
        }
      }
    }
  }, [
    ctx,
    textColor,
    actualFontSize,
    fontFamily,
    minStringLength,
    maxStringLength,
    generateBinaryString,
    getColorWithAlpha,
    fontLoaded,
    density,
  ]);

  return (
    <Canvas
      draw={draw}
      fps={speed}
      establishContext={establishContext}
      establishCanvasWidth={establishCanvasWidth}
      backgroundColor={finalBackgroundColor}
      backgroundImage={finalBackgroundImage}
    />
  );
};

export default MatrixRain;
