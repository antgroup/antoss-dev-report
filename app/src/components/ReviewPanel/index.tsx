import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { useAppContext } from '@/context';
import { OSS_ENDPOINT } from '@/constants';
import { fetchData } from '@/pages/02-load-data';

import styles from './index.module.scss';

interface ReviewData {
  like?: boolean;
  dislike?: boolean;
  comment?: string;
  visitCount?: number;
  noData?: boolean; // 标记无数据
}

interface ReviewPanelProps {
  onUserChange?: (loginId: string) => void;
}

const STORAGE_KEY = 'review_data';
const VISIT_COUNT_KEY = 'review_visit_count';
const ITEM_HEIGHT = 80; // 预估每个列表项的高度（包括padding和margin）
const OVERSCAN = 5; // 额外渲染的项目数量，用于平滑滚动

const ReviewPanel: React.FC<ReviewPanelProps> = ({ onUserChange }) => {
  const { userId, setUserId, setData } = useAppContext();
  const [logins, setLogins] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [reviews, setReviews] = useState<Record<string, ReviewData>>({});
  const [visitCounts, setVisitCounts] = useState<Record<string, number>>({});
  const [expandedItem, setExpandedItem] = useState<string | null>(null);
  const [commentInputs, setCommentInputs] = useState<Record<string, string>>({});
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<string>('all'); // all, reviewed, notReviewed, liked, disliked, commented
  const [scrollTop, setScrollTop] = useState(0);
  const [showImportExport, setShowImportExport] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // 从 localStorage 加载 review 数据和访问次数
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        setReviews(JSON.parse(stored));
        const parsed = JSON.parse(stored);
        // 恢复评论输入框的内容
        const inputs: Record<string, string> = {};
        Object.keys(parsed).forEach((login) => {
          if (parsed[login].comment) {
            inputs[login] = parsed[login].comment;
          }
        });
        setCommentInputs(inputs);
      }
    } catch (error) {
      console.error('Failed to load review data from localStorage:', error);
    }

    try {
      const visitStored = localStorage.getItem(VISIT_COUNT_KEY);
      if (visitStored) {
        setVisitCounts(JSON.parse(visitStored));
      }
    } catch (error) {
      console.error('Failed to load visit counts from localStorage:', error);
    }
  }, []);

  // 保存 review 数据到 localStorage
  const saveReviews = (newReviews: Record<string, ReviewData>) => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(newReviews));
      setReviews(newReviews);
    } catch (error) {
      console.error('Failed to save review data to localStorage:', error);
    }
  };

  // 保存访问次数到 localStorage
  const saveVisitCounts = (newCounts: Record<string, number>) => {
    try {
      localStorage.setItem(VISIT_COUNT_KEY, JSON.stringify(newCounts));
      setVisitCounts(newCounts);
    } catch (error) {
      console.error('Failed to save visit counts to localStorage:', error);
    }
  };

  // 增加访问次数
  const incrementVisitCount = (loginId: string) => {
    const newCounts = {
      ...visitCounts,
      [loginId]: (visitCounts[loginId] || 0) + 1,
    };
    saveVisitCounts(newCounts);
  };

  // 从 OSS 获取 login 列表
  useEffect(() => {
    const fetchLogins = async () => {
      try {
        const response = await fetch(`${OSS_ENDPOINT}/_logins.json`);
        if (response.ok) {
          const data = await response.json();
          // 假设返回的是数组或对象，根据实际格式调整
          if (Array.isArray(data)) {
            setLogins(data);
          } else if (typeof data === 'object') {
            setLogins(Object.keys(data));
          }
        } else {
          console.error('Failed to fetch logins:', response.status);
        }
      } catch (error) {
        console.error('Error fetching logins:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchLogins();
  }, []);

  // 过滤列表
  const filteredLogins = useMemo(() => {
    let result = logins;

    // 搜索过滤
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      result = result.filter((login) => login.toLowerCase().includes(term));
    }

    // 状态过滤
    if (filterType !== 'all') {
      result = result.filter((login) => {
        const review = reviews[login] || {};
        const hasReview = review.like || review.dislike || review.comment;

        switch (filterType) {
          case 'reviewed':
            return hasReview;
          case 'notReviewed':
            return !hasReview && !review.noData;
          case 'liked':
            return review.like === true;
          case 'disliked':
            return review.dislike === true;
          case 'commented':
            return !!review.comment;
          case 'noData':
            return review.noData === true;
          default:
            return true;
        }
      });
    }

    return result;
  }, [logins, searchTerm, filterType, reviews]);

  // 虚拟滚动计算
  const virtualScrollData = useMemo(() => {
    const totalItems = filteredLogins.length;
    if (totalItems === 0) {
      return {
        startIndex: 0,
        endIndex: 0,
        visibleItems: [],
        offsetY: 0,
        totalHeight: 0,
      };
    }

    // 如果容器还没有初始化，使用默认高度计算
    const containerHeight = listRef.current?.clientHeight || 600;
    const visibleCount = Math.ceil(containerHeight / ITEM_HEIGHT);
    const startIndex = Math.max(0, Math.floor(scrollTop / ITEM_HEIGHT) - OVERSCAN);
    const endIndex = Math.min(totalItems - 1, startIndex + visibleCount + OVERSCAN * 2);
    const visibleItems = filteredLogins.slice(startIndex, endIndex + 1);
    const offsetY = startIndex * ITEM_HEIGHT;
    const totalHeight = totalItems * ITEM_HEIGHT;

    return {
      startIndex,
      endIndex,
      visibleItems,
      offsetY,
      totalHeight,
    };
  }, [filteredLogins, scrollTop]);

  // 处理滚动
  const handleScroll = useCallback((e: React.UIEvent<HTMLDivElement>) => {
    setScrollTop(e.currentTarget.scrollTop);
  }, []);

  // 处理点击登录项
  const handleLoginClick = async (loginId: string) => {
    if (loginId === userId) return;

    // 增加访问次数
    incrementVisitCount(loginId);

    setUserId(loginId);
    onUserChange?.(loginId);

    // 加载数据，review模式跳过delay
    try {
      const data = await fetchData(loginId, { skipDelay: true });
      if (data) {
        setData(data);
        // 如果有数据，清除noData标记（如果之前标记过）
        if (reviews[loginId]?.noData) {
          const newReviews = {
            ...reviews,
            [loginId]: {
              ...reviews[loginId],
              noData: undefined,
            },
          };
          saveReviews(newReviews);
        }
      } else {
        // 如果没有数据，自动标记为noData
        const newReviews = {
          ...reviews,
          [loginId]: {
            ...reviews[loginId],
            noData: true,
          },
        };
        saveReviews(newReviews);
        // 跳转到not found页
        setData(null);
      }
    } catch (error) {
      console.error('Failed to load data for', loginId, error);
      // 出错时也标记为noData并跳转到not found页
      const newReviews = {
        ...reviews,
        [loginId]: {
          ...reviews[loginId],
          noData: true,
        },
      };
      saveReviews(newReviews);
      setData(null);
    }
  };

  // 处理清除无数据标记
  const handleClearNoData = (loginId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const newReviews = {
      ...reviews,
      [loginId]: {
        ...reviews[loginId],
        noData: undefined,
      },
    };
    saveReviews(newReviews);
  };

  // 处理点赞
  const handleLike = (loginId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const newReviews = {
      ...reviews,
      [loginId]: {
        ...reviews[loginId],
        like: reviews[loginId]?.like ? undefined : true,
        dislike: undefined, // 取消点踩
      },
    };
    saveReviews(newReviews);
  };

  // 处理点踩
  const handleDislike = (loginId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const newReviews = {
      ...reviews,
      [loginId]: {
        ...reviews[loginId],
        dislike: reviews[loginId]?.dislike ? undefined : true,
        like: undefined, // 取消点赞
      },
    };
    saveReviews(newReviews);
  };

  // 处理展开/收起评论
  const handleToggleComment = (loginId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setExpandedItem(expandedItem === loginId ? null : loginId);
  };

  // 处理评论输入
  const handleCommentChange = (loginId: string, value: string) => {
    setCommentInputs({
      ...commentInputs,
      [loginId]: value,
    });
  };

  // 处理保存评论
  const handleSaveComment = (loginId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const comment = commentInputs[loginId]?.trim() || '';
    const newReviews = {
      ...reviews,
      [loginId]: {
        ...reviews[loginId],
        comment: comment || undefined,
      },
    };
    saveReviews(newReviews);
    if (!comment) {
      setExpandedItem(null);
    }
  };

  // 处理取消评论
  const handleCancelComment = (loginId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setExpandedItem(null);
    // 恢复原始评论内容
    setCommentInputs({
      ...commentInputs,
      [loginId]: reviews[loginId]?.comment || '',
    });
  };

  // 导出数据
  const handleExport = () => {
    const exportData = {
      reviews,
      visitCounts,
      exportTime: new Date().toISOString(),
      version: '1.0',
    };
    const dataStr = JSON.stringify(exportData, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `review-data-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  // 导入数据
  const handleImport = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const importedData = JSON.parse(e.target?.result as string);
        const importedReviews = importedData.reviews || {};
        const importedVisitCounts = importedData.visitCounts || {};

        // 合并数据：保留本地数据，用导入数据覆盖（如果导入数据有值）
        const mergedReviews = { ...reviews };
        const mergedVisitCounts = { ...visitCounts };

        Object.keys(importedReviews).forEach((loginId) => {
          const imported = importedReviews[loginId];
          const local = mergedReviews[loginId] || {};

          // 合并策略：如果导入数据有值，则使用导入数据；否则保留本地数据
          mergedReviews[loginId] = {
            like: imported.like !== undefined ? imported.like : local.like,
            dislike: imported.dislike !== undefined ? imported.dislike : local.dislike,
            comment: imported.comment || local.comment,
          };
        });

        // 合并访问次数：取较大值
        Object.keys(importedVisitCounts).forEach((loginId) => {
          mergedVisitCounts[loginId] = Math.max(
            mergedVisitCounts[loginId] || 0,
            importedVisitCounts[loginId] || 0,
          );
        });

        // 保存合并后的数据
        saveReviews(mergedReviews);
        saveVisitCounts(mergedVisitCounts);

        // 更新评论输入框
        const inputs: Record<string, string> = {};
        Object.keys(mergedReviews).forEach((login) => {
          if (mergedReviews[login].comment) {
            inputs[login] = mergedReviews[login].comment || '';
          }
        });
        setCommentInputs(inputs);

        alert('数据导入成功！');
      } catch (error) {
        console.error('Failed to import data:', error);
        alert('导入失败：文件格式错误');
      }
    };
    reader.readAsText(file);

    // 重置文件输入
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  if (loading) {
    return (
      <div className={`${styles.panel} ${isCollapsed ? styles.collapsed : ''}`}>
        <div className={styles.header}>
          <span className={styles.title}>Review Mode</span>
          <button className={styles.toggleButton} onClick={() => setIsCollapsed(!isCollapsed)}>
            {isCollapsed ? '▶' : '◀'}
          </button>
        </div>
        <div className={styles.content}>
          <div className={styles.loading}>加载中...</div>
        </div>
      </div>
    );
  }

  return (
    <div ref={panelRef} className={`${styles.panel} ${isCollapsed ? styles.collapsed : ''}`}>
      <div className={styles.header}>
        <span className={styles.title}>Review Mode</span>
        <div className={styles.headerActions}>
          <button
            className={styles.iconButton}
            onClick={() => setShowImportExport(!showImportExport)}
            title="导入/导出"
          >
            📥
          </button>
          <button
            className={styles.toggleButton}
            onClick={() => setIsCollapsed(!isCollapsed)}
            title={isCollapsed ? '展开' : '收起'}
          >
            {isCollapsed ? '▶' : '◀'}
          </button>
        </div>
      </div>
      {showImportExport && !isCollapsed && (
        <div className={styles.importExportBox}>
          <div className={styles.importExportTitle}>数据管理</div>
          <div className={styles.importExportActions}>
            <button className={styles.exportButton} onClick={handleExport}>
              导出数据
            </button>
            <label className={styles.importButton}>
              导入数据
              <input
                ref={fileInputRef}
                type="file"
                accept=".json"
                onChange={handleImport}
                style={{ display: 'none' }}
              />
            </label>
          </div>
          <div className={styles.importExportHint}>
            导入时会合并数据：review数据会覆盖，访问次数取较大值
          </div>
        </div>
      )}
      {!isCollapsed && (
        <div className={styles.content}>
          <div className={styles.searchBox}>
            <input
              type="text"
              placeholder="搜索 login id..."
              className={styles.searchInput}
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setScrollTop(0); // 搜索时重置滚动位置
              }}
            />
            <div className={styles.filterButtons}>
              <button
                className={`${styles.filterButton} ${filterType === 'all' ? styles.active : ''}`}
                onClick={() => {
                  setFilterType('all');
                  setScrollTop(0);
                }}
              >
                全部
              </button>
              <button
                className={`${styles.filterButton} ${
                  filterType === 'reviewed' ? styles.active : ''
                }`}
                onClick={() => {
                  setFilterType('reviewed');
                  setScrollTop(0);
                }}
              >
                已review
              </button>
              <button
                className={`${styles.filterButton} ${
                  filterType === 'notReviewed' ? styles.active : ''
                }`}
                onClick={() => {
                  setFilterType('notReviewed');
                  setScrollTop(0);
                }}
              >
                未review
              </button>
              <button
                className={`${styles.filterButton} ${filterType === 'liked' ? styles.active : ''}`}
                onClick={() => {
                  setFilterType('liked');
                  setScrollTop(0);
                }}
              >
                点赞
              </button>
              <button
                className={`${styles.filterButton} ${
                  filterType === 'disliked' ? styles.active : ''
                }`}
                onClick={() => {
                  setFilterType('disliked');
                  setScrollTop(0);
                }}
              >
                点踩
              </button>
              <button
                className={`${styles.filterButton} ${
                  filterType === 'commented' ? styles.active : ''
                }`}
                onClick={() => {
                  setFilterType('commented');
                  setScrollTop(0);
                }}
              >
                留言
              </button>
              <button
                className={`${styles.filterButton} ${filterType === 'noData' ? styles.active : ''}`}
                onClick={() => {
                  setFilterType('noData');
                  setScrollTop(0);
                }}
              >
                无数据
              </button>
            </div>
            {filteredLogins.length > 0 && (
              <div className={styles.searchResult}>找到 {filteredLogins.length} 个结果</div>
            )}
          </div>
          <div
            ref={listRef}
            className={styles.list}
            onScroll={handleScroll}
            style={{ position: 'relative', overflow: 'auto' }}
          >
            <div
              style={{
                height: virtualScrollData.totalHeight,
                position: 'relative',
              }}
            >
              <div
                style={{
                  transform: `translateY(${virtualScrollData.offsetY}px)`,
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                }}
              >
                {virtualScrollData.visibleItems.map((loginId, index) => {
                  const actualIndex = virtualScrollData.startIndex + index;
                  const review = reviews[loginId] || {};
                  const isActive = loginId === userId;
                  const hasComment = !!review.comment;
                  const visitCount = visitCounts[loginId] || 0;
                  const hasReview = review.like || review.dislike || review.comment;
                  const isReviewed = !!hasReview;
                  const hasNoData = review.noData === true;

                  const isExpanded = expandedItem === loginId;
                  const itemHeight = isExpanded ? 'auto' : ITEM_HEIGHT;
                  const minHeight = ITEM_HEIGHT;

                  return (
                    <div
                      key={loginId}
                      data-index={actualIndex}
                      className={`${styles.listItem} ${isActive ? styles.active : ''} ${
                        isReviewed ? styles.reviewed : styles.notReviewed
                      } ${hasNoData ? styles.noData : ''}`}
                      onClick={() => handleLoginClick(loginId)}
                      style={{ minHeight, height: itemHeight }}
                    >
                      <div className={styles.itemHeader}>
                        <div className={styles.loginId}>
                          {loginId}
                          {hasNoData && (
                            <>
                              <span className={styles.noDataBadge} title="无数据">
                                ⚠️
                              </span>
                              <button
                                className={styles.clearNoDataButton}
                                onClick={(e) => handleClearNoData(loginId, e)}
                                title="清除无数据标记"
                              >
                                ✕
                              </button>
                            </>
                          )}
                        </div>
                        {visitCount > 0 && <div className={styles.visitCount}>{visitCount}</div>}
                      </div>
                      <div className={styles.actions}>
                        <button
                          className={`${styles.actionButton} ${styles.likeButton} ${
                            review.like ? styles.active : ''
                          }`}
                          onClick={(e) => handleLike(loginId, e)}
                          title="点赞"
                        >
                          👍
                        </button>
                        <button
                          className={`${styles.actionButton} ${styles.dislikeButton} ${
                            review.dislike ? styles.active : ''
                          }`}
                          onClick={(e) => handleDislike(loginId, e)}
                          title="点踩"
                        >
                          👎
                        </button>
                        <button
                          className={`${styles.actionButton} ${styles.commentButton} ${
                            hasComment ? styles.hasComment : ''
                          }`}
                          onClick={(e) => handleToggleComment(loginId, e)}
                          title="留言"
                        >
                          💬
                        </button>
                      </div>
                      {expandedItem === loginId && (
                        <div className={styles.commentBox} onClick={(e) => e.stopPropagation()}>
                          <textarea
                            className={styles.commentInput}
                            placeholder="输入评论..."
                            value={commentInputs[loginId] || review.comment || ''}
                            onChange={(e) => handleCommentChange(loginId, e.target.value)}
                            onClick={(e) => e.stopPropagation()}
                          />
                          <div className={styles.commentActions}>
                            <button
                              className={styles.saveButton}
                              onClick={(e) => handleSaveComment(loginId, e)}
                            >
                              保存
                            </button>
                            <button
                              className={styles.cancelButton}
                              onClick={(e) => handleCancelComment(loginId, e)}
                            >
                              取消
                            </button>
                          </div>
                        </div>
                      )}
                      {hasComment && expandedItem !== loginId && (
                        <div className={styles.commentPreview}>{review.comment}</div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ReviewPanel;
