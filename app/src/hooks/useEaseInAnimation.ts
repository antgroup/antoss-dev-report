import { useSwiperSlide } from 'swiper/react';

/**
 * 获取缓动出现动画类名的 Hook
 * 当 Swiper 页面激活时返回动画类名，否则返回空字符串
 * @returns 动画类名（'easeIn' 或 ''）
 */
export const useEaseInAnimation = (): string => {
  const { isActive } = useSwiperSlide();
  return isActive ? 'easeIn' : '';
};
