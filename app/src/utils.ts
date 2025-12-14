export function countEnglishAndChineseChars(str: string) {
  // 匹配英文字符
  const englishChars = str.match(/[a-zA-Z]/g) || [];
  const englishCount = englishChars.length;

  // 匹配中文字符
  const chineseChars = str.match(/[\u4e00-\u9fa5]/g) || [];
  const chineseCount = chineseChars.length;

  return {
    englishCount,
    chineseCount,
  };
}

export const ellipsisMiddle = (text: string, maxLength: number): string => {
  if (text.length <= maxLength) {
    return text;
  }

  const halfLength = Math.floor(maxLength / 2);
  let start = text.lastIndexOf(' ', halfLength);
  let end = text.indexOf(' ', text.length - halfLength);

  // 如果没有合适的空格，就使用原始的分割点
  if (start === -1 || end === -1) {
    start = halfLength;
    end = text.length - halfLength;
  }

  return `${text.slice(0, start + 1)}...${text.slice(end)}`;
};

/**
 * 省略文本中间部分，但保留完整的关键词
 * @param text 原始文本
 * @param keyword 需要保留的关键词
 * @param maxLength 最大长度
 * @returns 省略后的文本
 */
export const ellipsisMiddlePreservingKeyword = (
  text: string,
  keyword: string,
  maxLength: number,
): string => {
  if (text.length <= maxLength) {
    return text;
  }

  // 不区分大小写查找关键词位置
  const lowerText = text.toLowerCase();
  const lowerKeyword = keyword.toLowerCase();
  const keywordIndex = lowerText.indexOf(lowerKeyword);

  // 如果找不到关键词，使用普通的省略方法
  if (keywordIndex === -1) {
    return ellipsisMiddle(text, maxLength);
  }

  const keywordLength = keyword.length;
  const keywordEnd = keywordIndex + keywordLength;

  // 计算可用长度（减去关键词长度和省略号）
  const availableLength = maxLength - keywordLength - 3; // 3 是 "..." 的长度

  if (availableLength <= 0) {
    // 如果关键词本身就超过了最大长度，直接返回关键词
    return keyword;
  }

  // 计算前后各保留多少字符
  const beforeLength = Math.floor(availableLength / 2);
  const afterLength = availableLength - beforeLength;

  // 计算省略后的起始和结束位置
  let start = Math.max(0, keywordIndex - beforeLength);
  let end = Math.min(text.length, keywordEnd + afterLength);

  // 尝试在空格处截断，使文本更自然
  if (start > 0) {
    const spaceBefore = text.lastIndexOf(' ', start);
    if (spaceBefore > keywordIndex - beforeLength * 1.5) {
      start = spaceBefore + 1;
    }
  }

  if (end < text.length) {
    const spaceAfter = text.indexOf(' ', keywordEnd + afterLength);
    if (spaceAfter !== -1 && spaceAfter < keywordEnd + afterLength * 1.5) {
      end = spaceAfter;
    }
  }

  // 构建省略后的文本
  const beforeText =
    start > 0 ? `...${text.slice(start, keywordIndex)}` : text.slice(start, keywordIndex);
  const keywordText = text.slice(keywordIndex, keywordEnd);
  const afterText =
    end < text.length ? `${text.slice(keywordEnd, end)}...` : text.slice(keywordEnd, end);

  return `${beforeText}${keywordText}${afterText}`;
};

/**
 * 判断给定的小时是否为深夜时段
 * @param hour 小时数（0-23）
 * @returns 如果是深夜时段（22点-次日6点）则返回 true，否则返回 false
 */
export const isNightTime = (hour: number): boolean => {
  return hour >= 22 || hour < 6;
};

/**
 * 判断给定的时间段是否为深夜时段
 * @param startHour 开始小时（0-23）
 * @param endHour 结束小时（0-23）
 * @returns 如果时间段与深夜时段有重叠则返回 true，否则返回 false
 */
export const isNightTimeRange = (startHour: number, endHour: number): boolean => {
  // 深夜时段：22:00-06:00
  const nightStart = 22;
  const nightEnd = 6;

  // 如果开始或结束时间在深夜时段内
  if (isNightTime(startHour) || isNightTime(endHour)) {
    return true;
  }

  // 如果时间段跨越深夜（例如 20:00-23:00 或 4:00-8:00）
  // 处理跨越午夜的情况
  if (endHour < startHour) {
    // 时间段本身跨越午夜，检查是否与深夜时段重叠
    return true;
  }

  // 检查时间段是否完全包含深夜时段
  // 例如 20:00-08:00 这样的时段
  if (startHour < nightEnd && endHour > nightStart) {
    return true;
  }

  return false;
};

/**
 * 事件类型到标签的映射表
 */
const repoEventTypeLabelMap: Record<string, string> = {
  IssuesEvent: 'Issue',
  IssueCommentEvent: 'Issue',
  PullRequestEvent: 'PR',
  PullRequestReviewEvent: 'PR',
  PullRequestReviewCommentEvent: 'PR',
  PushEvent: 'Commit',
  WatchEvent: 'Star',
  ForkEvent: 'Fork',
  IssuesReactionEvent: 'Issue',
};

/**
 * 事件类型和动作组合到动作标签的映射表
 */
const repoEventActionLabelMap: Record<string, string> = {
  'IssuesEvent-opened': '创建',
  'IssuesEvent-closed': '关闭',
  'IssueCommentEvent-created': '评论',
  'PullRequestEvent-opened': '创建',
  'PullRequestEvent-closed': '关闭',
  'PullRequestReviewEvent-created': '评审',
  'PullRequestReviewCommentEvent-created': '评审',
  'PushEvent-added': '提交',
  'WatchEvent-started': 'Star',
  'ForkEvent-added': 'Fork',
};

/**
 * 获取事件类型的标签
 * @param eventType 事件类型（如 IssuesEvent, PullRequestEvent 等）
 * @returns 事件类型的标签
 */
export const getRepoEventTypeLabel = (eventType: string): string => {
  return repoEventTypeLabelMap[eventType] || eventType;
};

/**
 * 获取事件动作的标签
 * @param eventType 事件类型（如 IssuesEvent, PullRequestEvent 等）
 * @param eventAction 事件动作（如 opened, closed, created 等）
 * @returns 事件动作的标签
 */
export const getRepoEventActionLabel = (eventType: string, eventAction: string): string => {
  const key = `${eventType}-${eventAction}`;
  return repoEventActionLabelMap[key] || '参与';
};

/**
 * 表情类型到 emoji 的映射表
 */
const reactionEmojiMap: Record<string, string> = {
  THUMBS_UP: '👍',
  THUMBS_DOWN: '👎',
  LAUGH: '😄',
  HOORAY: '🎉',
  CONFUSED: '😕',
  HEART: '❤️',
  ROCKET: '🚀',
  NEUTRAL: '',
};

/**
 * 获取表情类型对应的 emoji
 * @param reactionType 表情类型（如 THUMBS_UP, HEART 等）
 * @returns 对应的 emoji 字符串
 */
export const getReactionEmoji = (reactionType: string): string => {
  return reactionEmojiMap[reactionType] || '';
};

/**
 * 获取事件类型和动作的组合描述
 * @param eventType 事件类型（如 IssuesEvent, PullRequestEvent 等）
 * @param eventAction 事件动作（如 opened, closed, created 等）
 * @returns 组合描述文本，格式为 "动作 + 类型"，如 "创建 Issue"、"提交 Commit" 等
 */
export const getRepoEventDescription = (eventType: string, eventAction: string): string => {
  const actionLabel = getRepoEventActionLabel(eventType, eventAction);
  const typeLabel = getRepoEventTypeLabel(eventType);
  return `${actionLabel}${typeLabel}`;
};

/**
 * 头像 URL 缓存，用于存储已检查的结果
 */
const avatarUrlCache = new Map<string, string>();

/**
 * 头像加载失败缓存，用于存储已知不存在的 OSS 头像
 */
const avatarFailedCache = new Set<string>();

/**
 * 通过图片预加载检测 URL 是否可访问
 * 这比 HEAD 请求更高效，因为浏览器会复用连接，且只需要一次请求
 */
const checkImageExists = (url: string): Promise<boolean> => {
  return new Promise((resolve) => {
    // 如果已经在失败缓存中，直接返回 false
    if (avatarFailedCache.has(url)) {
      resolve(false);
      return;
    }

    const img = new Image();
    let resolved = false;

    // 设置超时，避免长时间等待
    const timeout = setTimeout(() => {
      if (!resolved) {
        resolved = true;
        avatarFailedCache.add(url);
        img.onload = null;
        img.onerror = null;
        resolve(false);
      }
    }, 3000); // 3秒超时

    img.onload = () => {
      clearTimeout(timeout);
      if (!resolved) {
        resolved = true;
        img.onload = null;
        img.onerror = null;
        resolve(true);
      }
    };

    img.onerror = () => {
      clearTimeout(timeout);
      if (!resolved) {
        resolved = true;
        // 记录失败，避免重复尝试
        avatarFailedCache.add(url);
        img.onload = null;
        img.onerror = null;
        resolve(false);
      }
    };

    img.src = url;
  });
};

/**
 * 获取开发者头像 URL
 * 优先从 OSS 获取，如果不存在则使用 GitHub 头像
 * 使用图片预加载而不是 HEAD 请求，减少网络请求数量
 * @param login 开发者登录名
 * @param useLowerCase 是否将 login 转换为小写（默认 false）
 * @returns Promise<string> 头像 URL
 */
export const getAvatarUrl = async (login: string, useLowerCase = true): Promise<string> => {
  const normalizedLogin = useLowerCase ? login.toLowerCase() : login;
  const cacheKey = normalizedLogin;

  // 检查缓存
  if (avatarUrlCache.has(cacheKey)) {
    return avatarUrlCache.get(cacheKey)!;
  }

  const { OSS_ENDPOINT } = await import('@/constants');
  const ossUrl = `${OSS_ENDPOINT}/${normalizedLogin}.png`;
  const githubUrl = `https://github.com/${normalizedLogin}.png`;

  // 使用图片预加载检测，比 HEAD 请求更高效
  const exists = await checkImageExists(ossUrl);
  if (exists) {
    // OSS 文件存在，缓存并返回 OSS URL
    avatarUrlCache.set(cacheKey, ossUrl);
    return ossUrl;
  }

  // OSS 文件不存在，使用 GitHub 头像
  avatarUrlCache.set(cacheKey, githubUrl);
  return githubUrl;
};

/**
 * 检测是否为移动端设备
 * @returns 如果是移动端返回 true，否则返回 false
 */
export const isMobile = (): boolean => {
  if (typeof window === 'undefined') {
    return false;
  }
  // 检测触摸屏
  const hasTouchScreen =
    'ontouchstart' in window ||
    navigator.maxTouchPoints > 0 ||
    // @ts-ignore
    navigator.msMaxTouchPoints > 0;
  // 检测用户代理
  const userAgent = navigator.userAgent || navigator.vendor || (window as any).opera;
  const mobileRegex =
    /android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini|mobile|tablet/i;
  const isMobileUserAgent = mobileRegex.test(userAgent);
  // 检测屏幕宽度（小于 768px 认为是移动端）
  const isSmallScreen = window.innerWidth < 768;
  return hasTouchScreen || isMobileUserAgent || isSmallScreen;
};
