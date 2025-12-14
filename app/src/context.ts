import constate from 'constate';
import { useState } from 'react';

import { Data } from '@/types';

const useApp = () => {
  // 从 url 参数中获取 userId
  const urlParams = new URLSearchParams(window.location.search);
  const urlUserId = urlParams.get('id');
  const [userId, setUserId] = useState(urlUserId || '');
  const [data, setData] = useState<Data | null>(null);
  const [screenshotUrls, setScreenshotUrls] = useState<Record<string, string>>({});
  const [resourcesLoaded, setResourcesLoaded] = useState(false);

  return {
    userId,
    setUserId,
    data,
    setData,
    screenshotUrls,
    setScreenshotUrls,
    resourcesLoaded,
    setResourcesLoaded,
  };
};

export const [AppProvider, useAppContext] = constate(useApp);
