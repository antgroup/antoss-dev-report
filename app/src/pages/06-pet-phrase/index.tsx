import React, { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { useSwiperSlide } from 'swiper/react';

import { useAppContext } from '@/context';
import ComputerBottomLayout from '@/layouts/ComputerBottomLayout';
import { PageId } from '@/pages/types';
import { ellipsisMiddlePreservingKeyword } from '@/utils';
import TextType from '@/components/TextType';

import styles from './index.module.scss';

// 辅助函数：转义正则表达式中的特殊字符
function escapeRegExp(str: string): string {
  return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'); // $& 表示原始匹配项
}

// 辅助函数：高亮文本中的关键词
function highlightPetPhrase(text: string, petPhrase: string): React.ReactNode[] {
  const escapedPetPhrase = escapeRegExp(petPhrase);
  const regex = new RegExp(`(${escapedPetPhrase})`, 'gi');
  const parts = text.split(regex);

  let offset = 0;
  return parts.map((part) => {
    const start = offset;
    offset += part.length;
    const isHighlight = part.toLowerCase() === petPhrase.toLowerCase();
    return isHighlight ? (
      <span key={`${start}-${part.length}-highlight`} className={styles.highlight}>
        {part}
      </span>
    ) : (
      <span key={`${start}-${part.length}`}>{part}</span>
    );
  });
}

const PetPhrasePage = () => {
  const { data } = useAppContext() as {
    data: NonNullable<ReturnType<typeof useAppContext>['data']>;
  };

  const { isActive } = useSwiperSlide();
  const { petPhrase, petPhraseSamples } = data;

  const [showTextType1, setShowTextType1] = useState(false);
  const [showTextType2, setShowTextType2] = useState(false);

  // Refs for animation
  const textType1Ref = useRef<HTMLDivElement>(null);
  const textType2Ref = useRef<HTMLDivElement>(null);
  const petPhraseRef = useRef<HTMLDivElement>(null);
  const samplesRefs = useRef<Array<HTMLDivElement | null>>([]);
  const bottomAreaRef = useRef<HTMLDivElement>(null);

  // GSAP 动画控制
  useEffect(() => {
    if (!isActive) {
      // 重置状态
      setShowTextType1(false);
      setShowTextType2(false);

      // 清理所有动画
      [textType1Ref.current, textType2Ref.current, petPhraseRef.current, bottomAreaRef.current]
        .filter(Boolean)
        .forEach((el) => {
          if (el) gsap.killTweensOf(el);
        });
      samplesRefs.current.forEach((el) => {
        if (el) gsap.killTweensOf(el);
      });
      return;
    }

    const tl = gsap.timeline();

    // 初始化所有元素为隐藏状态
    gsap.set(textType1Ref.current, { opacity: 0 });
    gsap.set(textType2Ref.current, { opacity: 0 });
    if (petPhraseRef.current) {
      gsap.set(petPhraseRef.current, { opacity: 0, scale: 0 });
    }
    samplesRefs.current.forEach((el) => {
      if (el) {
        gsap.set(el, { opacity: 0, y: 20 });
      }
    });
    gsap.set(bottomAreaRef.current, { opacity: 0 });

    // 0.2s 后显示第一个 TextType
    tl.to(textType1Ref.current, {
      opacity: 1,
      duration: 0.3,
      ease: 'power2.out',
    }).call(
      () => {
        setShowTextType1(true);
      },
      [],
      '<',
    );

    // 等待第一个 TextType 打字完成（约 0.4s）后显示第二个 TextType
    tl.to(
      textType2Ref.current,
      {
        opacity: 1,
        duration: 0.3,
        ease: 'power2.out',
      },
      '+=0.4',
    ).call(
      () => {
        setShowTextType2(true);
      },
      [],
      '<',
    );

    // 等待第二个 TextType 打字完成（约 1s）后开始关键词动画
    if (petPhraseRef.current && petPhraseSamples && petPhraseSamples.length > 0) {
      // 关键词放大缩小次数等于samples数量（有弹性的）
      const bounceCount = petPhraseSamples.length;
      const scaleValue = 1.5;

      // 第一次放大缩小
      tl.to(
        petPhraseRef.current,
        {
          opacity: 1,
          scale: scaleValue,
          duration: 0.4,
          ease: 'elastic.out(1, 0.5)',
        },
        '+=1',
      ).to(
        petPhraseRef.current,
        {
          scale: 1,
          duration: 0.3,
          ease: 'power2.out',
        },
        '+=0.2',
      );

      // 根据samples数量循环放大缩小
      for (let i = 1; i < bounceCount; i++) {
        tl.to(
          petPhraseRef.current,
          {
            scale: scaleValue,
            duration: 0.4,
            ease: 'elastic.out(1, 0.5)',
          },
          '+=0.3',
        ).to(
          petPhraseRef.current,
          {
            scale: 1,
            duration: 0.3,
            ease: 'power2.out',
          },
          '+=0.2',
        );
      }
    }

    // 显示底部区域
    tl.to(
      bottomAreaRef.current,
      {
        opacity: 1,
        duration: 0.5,
        ease: 'power2.out',
      },
      '+=0.3',
    );

    // Samples 逐个出现
    samplesRefs.current.forEach((el, index) => {
      if (el) {
        tl.to(
          el,
          {
            opacity: 1,
            y: 0,
            duration: 0.4,
            ease: 'power2.out',
          },
          `+=${index * 0.15}`,
        );
      }
    });

    return () => {
      tl.kill();
    };
  }, [isActive, petPhrase, petPhraseSamples]);

  return (
    <ComputerBottomLayout
      name={PageId.ActiveTime}
      matrixRainBackgroundColor="#e8e8e8"
      topContent={
        <div className={styles.topContent}>
          <div className={styles.year}>2025</div>
          <div>在吗？在码！</div>
        </div>
      }
      paperContent={
        <div className={styles.paperContent}>
          {/* 顶部区域 */}
          <div className={styles.topArea}>
            <div ref={textType1Ref} style={{ opacity: 0, minHeight: '1.2em' }}>
              {showTextType1 ? (
                <TextType
                  text="你的年度贡献"
                  typingSpeed={80}
                  pauseDuration={500}
                  loop={false}
                  showCursor={false}
                  initialDelay={0}
                />
              ) : (
                <div>你的年度贡献</div>
              )}
            </div>
            <div ref={textType2Ref} style={{ opacity: 0, minHeight: '1.2em' }}>
              {showTextType2 ? (
                <TextType
                  text="关键词是"
                  typingSpeed={80}
                  pauseDuration={500}
                  loop={false}
                  showCursor={false}
                />
              ) : (
                ''
              )}
            </div>
          </div>
          {/* 中间区域 - 关键词 */}
          <div className={styles.centerArea}>
            {petPhrase && (
              <div ref={petPhraseRef} className={styles.petPhrase}>
                {petPhrase}
              </div>
            )}
          </div>
          {/* 底部区域 - 包含关键词的内容 */}
          <div ref={bottomAreaRef} className={styles.bottomArea} style={{ opacity: 0 }}>
            {petPhrase &&
              petPhraseSamples?.map((sample, index) => {
                const text = sample.text || sample.textFull;
                const ellipsedText = ellipsisMiddlePreservingKeyword(text, petPhrase, 120);
                return (
                  <div
                    key={`${sample.repo}-${sample.num}`}
                    ref={(el) => {
                      samplesRefs.current[index] = el;
                    }}
                    style={{ opacity: 0 }}
                  >
                    <span className={styles.quote}>&ldquo;</span>
                    {highlightPetPhrase(ellipsedText, petPhrase)}
                    <span className={styles.quote}>&rdquo;</span>
                    <a
                      href={`https://github.com/${sample.repo}/issues/${sample.num}`}
                      target="_blank"
                      rel="noreferrer"
                      className={styles.issueLink}
                    >
                      {`[#${sample.num}]`}
                    </a>
                  </div>
                );
              })}
          </div>
        </div>
      }
    />
  );
};

export default PetPhrasePage;
