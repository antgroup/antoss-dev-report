import { useState, useEffect } from 'react';
import { getAvatarUrl } from '@/utils';
import { OSS_ENDPOINT } from '@/constants';

/**
 * 获取开发者头像 URL 的 Hook
 * @param login 开发者登录名
 * @param useLowerCase 是否将 login 转换为小写（默认 false）
 * @returns 头像 URL，初始值为空字符串，加载完成后更新
 */
export const useAvatarUrl = (login: string, useLowerCase = true): string => {
  const [avatarUrl, setAvatarUrl] = useState<string>(`${OSS_ENDPOINT}/${login.toLowerCase()}.png`);

  useEffect(() => {
    if (!login) {
      return;
    }

    getAvatarUrl(login, useLowerCase)
      .then(setAvatarUrl)
      .catch(() => {
        // 如果获取失败，使用 GitHub 头像作为后备
        const normalizedLogin = useLowerCase ? login.toLowerCase() : login;
        setAvatarUrl(`https://github.com/${normalizedLogin}.png`);
      });
  }, [login, useLowerCase]);

  return avatarUrl;
};
