import { useEffect, useRef } from 'react';
import { useSwiperSlide } from 'swiper/react';
import Confetti, { ConfettiRef } from '@/components/Confetti';
import { isMobile } from '@/utils';

/**
 * ConfettiSequence 组件
 * 封装了 confetti 播放的完整序列：
 * - 移动端：default -> snow
 * - 桌面端：default -> school-pride -> snow
 * 在移动端减少 snow 粒子数量以提升性能
 */
const ConfettiSequence = () => {
  const { isActive } = useSwiperSlide();
  const defaultConfettiRef = useRef<ConfettiRef>(null);
  const schoolPrideConfettiRef = useRef<ConfettiRef>(null);
  const snowConfettiRef = useRef<ConfettiRef>(null);

  const isMobileDevice = isMobile();

  useEffect(() => {
    if (isActive) {
      if (isMobileDevice) {
        // 移动端：先播放基础款
        setTimeout(() => {
          defaultConfettiRef.current?.fire();
        }, 1000);

        // 基础款播放结束后（约3秒），开始播放 snow 款，持续播放
        setTimeout(() => {
          snowConfettiRef.current?.fire();
        }, 4000);
      } else {
        // 桌面端：先播放基础款
        setTimeout(() => {
          defaultConfettiRef.current?.fire();
        }, 1000);

        // 基础款播放结束后（约3秒），开始播放 school-pride 款
        setTimeout(() => {
          schoolPrideConfettiRef.current?.fire();
        }, 4000);

        // school-pride 播放结束后（约7秒），开始播放 snow 款，持续播放
        setTimeout(() => {
          snowConfettiRef.current?.fire();
        }, 11000);
      }
    } else {
      // 离开页面时停止 snow 动画
      snowConfettiRef.current?.stop();
    }
  }, [isActive, isMobileDevice]);

  return (
    <>
      <Confetti ref={defaultConfettiRef} type="default" />
      {!isMobileDevice && <Confetti ref={schoolPrideConfettiRef} type="school-pride" />}
      <Confetti ref={snowConfettiRef} type="snow" reduced={isMobileDevice} />
    </>
  );
};

export default ConfettiSequence;
