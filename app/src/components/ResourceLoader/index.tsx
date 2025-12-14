import React, { useEffect, useState } from 'react';

import { resourceManager } from '@/utils/ResourceManager';
import { useAppContext } from '@/context';
import Loading from '@/components/Loading';
import antOpenSourceLogo from '@/assets/ant-open-source-logo.png';
import RetroComputer from '../RetroComputer';

import styles from './index.module.scss';

/**
 * 资源加载组件
 * 封装 ResourceManager 的使用，负责预加载所有资源
 */
const ResourceLoader: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { resourcesLoaded, setResourcesLoaded } = useAppContext();
  const [loadingProgress, setLoadingProgress] = useState(0);

  useEffect(() => {
    // 如果已经加载完成，直接返回
    if (resourcesLoaded) {
      return;
    }

    // 异步初始化资源
    async function initResources() {
      try {
        // 1. 注册字体资源（硬编码）
        resourceManager.registerFontResources();

        // 2. 收集所有图片资源（不依赖组件渲染）
        await resourceManager.collectAllImageResources();

        // 3. 注册 CSS 中使用的资源
        await resourceManager.registerCssResources();

        // 4. 预加载所有资源，显示进度
        await resourceManager.preloadAll((progress) => {
          setLoadingProgress(progress.percentage);

          // 当进度达到100%时，立即完成加载
          if (progress.percentage >= 100) {
            setTimeout(() => {
              setResourcesLoaded(true);
            }, 1000);
          }
        });
      } catch (error) {
        // eslint-disable-next-line no-console
        console.error('资源加载失败:', error);
        setResourcesLoaded(true);
      }
    }

    initResources();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // 只在组件挂载时执行一次

  // 如果正在加载，显示 Loading UI
  if (!resourcesLoaded) {
    return (
      <div className={styles.background}>
        <div className={styles.container}>
          <RetroComputer className={styles.computer}>
            <div className={styles.loadingContainer}>
              <Loading progress={loadingProgress} className={styles.loading} />
            </div>
          </RetroComputer>
          <img className={styles.logo} src={antOpenSourceLogo} />
        </div>
      </div>
    );
  }

  // 资源加载完成，渲染子组件
  return <>{children}</>;
};

export default ResourceLoader;
