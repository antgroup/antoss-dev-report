import { useEffect } from 'react';
import { useSwiper, useSwiperSlide } from 'swiper/react';

import { DATA_LOAD_DELAY, OSS_ENDPOINT } from '@/constants';
import { PageId } from '@/pages/types';
import BaseLayout from '@/layouts/BaseLayout';
import { useAppContext } from '@/context';
import { Data } from '@/types';
import AddressBar from '@/components/AddressBar';
import folder from './folder.png';

import styles from './index.module.scss';

export const fetchData = async (
  userId: string,
  options?: { skipDelay?: boolean },
): Promise<Data | null> => {
  const startTime = Date.now();

  const fetchPromise = fetch(`${OSS_ENDPOINT}/${userId.toLowerCase()}.json`);

  let data: Data | null = null;
  const res = await fetchPromise;
  if (res.status === 200) {
    data = (await res.json()) as Data;
  } else {
    data = null;
  }

  // 如果设置了 skipDelay，则跳过延迟
  if (!options?.skipDelay) {
    const elapsed = Date.now() - startTime;
    if (elapsed < DATA_LOAD_DELAY) {
      await new Promise((resolve) => setTimeout(resolve, DATA_LOAD_DELAY - elapsed));
    }
  }

  return data;
};

const LoadDataPage = () => {
  const { data, setData, userId } = useAppContext();
  const swiper = useSwiper();
  const { isActive } = useSwiperSlide();

  useEffect(() => {
    // 只在当前 slide 激活时才执行数据加载
    if (!userId || !isActive) {
      return;
    }

    const loadData = async () => {
      const fetchedData = await fetchData(userId);
      if (fetchedData) {
        setData(fetchedData); // 如果 data 有值，会条件渲染到另一组页面（见 App.tsx 中相关逻辑）
      } else {
        swiper.slideNext(); // 如果 data 没有值，会跳转到该组页面的下一页 404 Not Found
      }
    };
    loadData();
  }, [isActive, userId, setData, data, swiper]);

  return (
    <BaseLayout name={PageId.LoadData} hideNavButtons>
      {/* OPEN SOURCE 地址栏 */}
      <div className={styles.topArea}>
        <AddressBar />
      </div>
      {/* 底部区域 */}
      <div className={styles.bottomArea}>
        <div className={styles.center}>
          <img className={styles.folder} src={folder} />
          <div className={styles.githubLogin}>GitHub Login</div>
          <div className={styles.loadingText}>
            开启年报中
            <span className={styles.dots}>
              <span className={styles.dot}>.</span>
              <span className={styles.dot}>.</span>
              <span className={styles.dot}>.</span>
            </span>
          </div>
        </div>
      </div>
    </BaseLayout>
  );
};

export default LoadDataPage;
