import { useState, useEffect } from 'react';
import { getAvatarUrl } from '@/utils';
import { OSS_ENDPOINT } from '@/constants';

/**
 * 获取组织头像 URL 的 Hook
 * @param orgName 组织名称
 * @param useLowerCase 是否将 orgName 转换为小写（默认 false）
 * @returns 头像 URL，初始值为 OSS URL，加载完成后更新
 */
export const useOrgAvatarUrl = (orgName: string, useLowerCase = true): string => {
  const [avatarUrl, setAvatarUrl] = useState<string>(
    `${OSS_ENDPOINT}/${orgName.toLowerCase()}.png`,
  );

  useEffect(() => {
    if (!orgName) {
      return;
    }

    getAvatarUrl(orgName, useLowerCase)
      .then(setAvatarUrl)
      .catch(() => {
        // 如果获取失败，使用 GitHub 头像作为后备
        const normalizedOrgName = useLowerCase ? orgName.toLowerCase() : orgName;
        setAvatarUrl(`https://github.com/${normalizedOrgName}.png`);
      });
  }, [orgName, useLowerCase]);

  return avatarUrl;
};
