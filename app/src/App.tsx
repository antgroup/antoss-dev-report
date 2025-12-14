import React, { useEffect, useRef, useState, useMemo } from 'react';
import { EffectFade } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/react';
import type { Swiper as SwiperType } from 'swiper';

import { SWIPER_DELAY } from '@/constants';
import { PageId } from '@/pages/types';
import { AppProvider, useAppContext } from '@/context';
import ResourceLoader from '@/components/ResourceLoader';
import ErrorBoundary from '@/components/ErrorBoundary';
import ReviewPanel from '@/components/ReviewPanel';
import WelcomePage from '@/pages/01-welcome';
import LoadDataPage from '@/pages/02-load-data';
import NotFoundPage from '@/pages/03b-not-found';
import SummaryPage from '@/pages/03a-summary';
import FavouritePage from '@/pages/04-favourite';
import NightTimePage from '@/pages/05a-night-time';
import ActiveTimePage from '@/pages/05b-active-time';
import PetPhrasePage from '@/pages/06-pet-phrase';
import FlightGamePage from '@/pages/07-flight-game';
import OpenrankLevelPage from '@/pages/08-openrank-level';
import FirstMeetingPage from '@/pages/09-first-meeting';
import MostParticipateIssuePage from '@/pages/10-most-participate-issue';
import ThanksPage from '@/pages/11-thanks';
import EmployeeInvitationPage from '@/pages/12a-employee-invitation';
import CommunityStarGiftPage from '@/pages/12b-community-star-gift';
import { isNightTime } from '@/utils';

import 'swiper/css';
import 'swiper/css/effect-fade';
import './App.css';

const Pages: React.FC = () => {
  const { data } = useAppContext();
  const swiperRef = useRef<SwiperType | null>(null);
  const [activeIndex, setActiveIndex] = useState(0);

  // 判断是否有深夜活动（在 useMemo 之前计算，避免条件调用 hook）
  const hasNightTime =
    data?.loveRepoHour !== undefined && data ? isNightTime(data.loveRepoHour) : false;

  // 构建页面列表，用于计算索引
  const pageList = useMemo(() => {
    if (!data) return [];
    const pages: Array<{ id: PageId; component: React.ReactNode }> = [
      { id: PageId.Summary, component: <SummaryPage /> },
      { id: PageId.Favourite, component: <FavouritePage /> },
    ];
    if (hasNightTime) {
      pages.push({ id: PageId.NightTime, component: <NightTimePage /> });
    }
    pages.push({ id: PageId.ActiveTime, component: <ActiveTimePage /> });
    if (data.petPhrase && data.petPhraseSamples && data.petPhraseSamples.length > 0) {
      pages.push({ id: PageId.PetPhrase, component: <PetPhrasePage /> });
    }
    pages.push({ id: PageId.FlightGame, component: <FlightGamePage /> });
    pages.push({ id: PageId.OpenrankLevel, component: <OpenrankLevelPage /> });
    pages.push({ id: PageId.FirstMeeting, component: <FirstMeetingPage /> });
    if (data.mostParticipateIssueRepoName) {
      pages.push({ id: PageId.MostParticipateIssue, component: <MostParticipateIssuePage /> });
    }
    pages.push({ id: PageId.Thanks, component: <ThanksPage /> });
    if (data.isEmployee) {
      pages.push({ id: PageId.EmployeeInvitation, component: <EmployeeInvitationPage /> });
    }
    if (data.isCommunityStar) {
      pages.push({ id: PageId.CommunityStarGift, component: <CommunityStarGiftPage /> });
    }
    return pages;
  }, [data, hasNightTime]);

  // 判断页面是否应该渲染（只渲染当前页面和相邻页面）
  const shouldRenderPage = (index: number) => {
    return Math.abs(index - activeIndex) <= 1;
  };

  // 处理键盘左右键
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (!swiperRef.current) return;

      // 如果焦点在输入框、文本域等可输入元素上，不处理翻页
      const target = event.target as HTMLElement;
      if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.isContentEditable) {
        return;
      }

      // 左右键也支持翻页（在垂直方向下，左右键等同于上下键）
      if (event.key === 'ArrowLeft' || event.key === 'ArrowUp') {
        event.preventDefault();
        swiperRef.current.slidePrev();
      } else if (event.key === 'ArrowRight' || event.key === 'ArrowDown') {
        event.preventDefault();
        swiperRef.current.slideNext();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  if (!data) {
    return (
      <Swiper
        style={{ height: '100%' }}
        effect={'fade'}
        speed={SWIPER_DELAY}
        modules={[EffectFade]}
        direction="vertical"
        keyboard
        onSwiper={(swiper) => {
          swiperRef.current = swiper;
        }}
        noSwiping
      >
        <SwiperSlide key={PageId.Welcome} className="swiper-no-swiping swiper-no-mousewheel">
          <WelcomePage />
        </SwiperSlide>
        <SwiperSlide key={PageId.LoadData} className="swiper-no-swiping swiper-no-mousewheel">
          <LoadDataPage />
        </SwiperSlide>
        <SwiperSlide key={PageId.NotFound} className="swiper-no-swiping swiper-no-mousewheel">
          <NotFoundPage />
        </SwiperSlide>
      </Swiper>
    );
  }

  return (
    <Swiper
      key={data.login} // 使用 login 作为 key，确保数据变化时重新创建 Swiper
      style={{ height: '100%' }}
      effect={'fade'}
      speed={SWIPER_DELAY}
      modules={[EffectFade]}
      direction="vertical"
      mousewheel
      keyboard
      observer
      observeParents
      onSwiper={(swiper) => {
        swiperRef.current = swiper;
        setActiveIndex(swiper.activeIndex);
      }}
      onSlideChange={(swiper) => {
        setActiveIndex(swiper.activeIndex);
      }}
      noSwiping
      initialSlide={0} // 确保从第一页开始
    >
      {pageList.map((page, index) => (
        <SwiperSlide key={page.id} className="swiper-no-mousewheel">
          {shouldRenderPage(index) ? (
            <ErrorBoundary pageId={page.id}>{page.component}</ErrorBoundary>
          ) : (
            <div style={{ height: '100%' }} />
          )}
        </SwiperSlide>
      ))}
    </Swiper>
  );
};

function App() {
  // 检查URL参数中是否有 review=1
  const urlParams = new URLSearchParams(window.location.search);
  const isReviewMode = urlParams.get('review') === '1';

  return (
    <AppProvider>
      <ResourceLoader>
        {isReviewMode && <ReviewPanel />}
        <Pages />
      </ResourceLoader>
    </AppProvider>
  );
}

export default App;
