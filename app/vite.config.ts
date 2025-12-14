import dsv from '@rollup/plugin-dsv';
import react from '@vitejs/plugin-react';
import path from 'path';
import postCssPxToRem from 'postcss-pxtorem';
import { defineConfig } from 'vite';

const BASE_PATH = process.env.BASE_PATH || '/';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), dsv()],
  base: BASE_PATH,
  define: {
    // 定义全局变量，在代码中可以通过 import.meta.env.BASE_PATH 访问
    'import.meta.env.BASE_PATH': JSON.stringify(BASE_PATH),
  },
  css: {
    preprocessorOptions: {
      scss: {
        additionalData: `@use "./src/styles/common.scss" as *;`,
      },
    },
    postcss: {
      plugins: [
        // rem 适配 step 2，将设计稿中的 px 值转换为 rem（这样写代码的时候直接用设计稿的 px 来写即可）
        // 为什么要 rem 适配？See https://juejin.cn/post/7132037611060740103
        postCssPxToRem({
          rootValue: 75, // rootValue 为设计稿宽度 px 值除以 10，移动端设计稿一般宽度为 750 px
          propList: ['*'],
          selectorBlackList: ['norem'], // 过滤掉 .norem 类名，不进行 rem 转换
          minPixelValue: 2, // 设置要替换的最小像素值（3px会被转rem，1px不会被转）
        }),
      ],
    },
  },
  resolve: {
    alias: [
      { find: '@', replacement: path.resolve(__dirname, 'src') }, // 使用path.resolve来指定绝对路径
    ],
  },
});
