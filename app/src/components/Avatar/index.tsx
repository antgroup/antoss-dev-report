import React from 'react';
import antOpenSourceIcon from '@/assets/ant-open-source-icon.png';
import styles from './index.module.scss';

interface AvatarProps {
  src: string;
  className?: string;
  isAnt?: boolean;
  href?: string;
}

const Avatar: React.FC<AvatarProps> = ({ src, className, isAnt, href }) => {
  const avatarContent = (
    <>
      <svg width="100%" viewBox="0 0 155 136" version="1.1" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <polygon
            id="path-2"
            points="20.9323313 124 20.9323313 110.210934 9.99887405 110.210934 9.99887405 100.2696 0 100.2696 0 24.1730429 9.99887405 24.1730429 9.99887405 11.2964756 20.9323313 11.2964756 20.9323313 -2.27373675e-13 122.067669 -2.27373675e-13 122.067669 11.2964756 133.001126 11.2964756 133.001126 24.1730429 143 24.1730429 143 100.2696 133.001126 100.2696 133.001126 110.210934 122.067669 110.210934 122.067669 124"
          />
        </defs>
        <g id="页面-1" stroke="none" strokeWidth="1" fill="none" fillRule="evenodd">
          <g id="第四页" transform="translate(-298, -529)">
            <g
              id="3bd8b3784dfa6ec29018a08cfcd41fe294d660d9a344-V1DfBN_fw1200备份"
              transform="translate(304, 535)"
            >
              <mask id="mask-3" fill="white">
                <use xlinkHref="#path-2" />
              </mask>
              {/* 默认背景色 */}
              <rect x="0" y="0" width="143" height="124" fill="#e8e8e8" mask="url(#mask-3)" />
              {/* 头像图片，使用 mask 裁剪超出边框的部分 */}
              <image
                href={src}
                x="-3.5"
                y="-10"
                width="150"
                height="140"
                mask="url(#mask-3)"
                preserveAspectRatio="xMidYMid slice"
              />
              {/* 边框 */}
              <path
                stroke="#000000"
                strokeWidth="5.8490566"
                d="M124.992197,8.3719474 L135.925654,8.37194735 L135.925654,21.2485146 L145.924528,21.2485146 L145.924528,103.194129 L135.925654,103.194129 L135.925654,113.135463 L124.992197,113.135463 L124.992197,126.924528 L18.007803,126.924528 L18.0078031,113.135463 L7.07434574,113.135463 L7.07434579,103.194129 L-2.9245283,103.194129 L-2.9245283,21.2485146 L7.07434579,21.2485146 L7.07434574,8.37194735 L18.0078031,8.3719474 L18.007803,-2.9245283 L124.992197,-2.9245283 Z"
              />
            </g>
          </g>
        </g>
      </svg>
      {isAnt && (
        <div className={styles.badge}>
          <img src={antOpenSourceIcon} alt="ant open source" className={styles.badgeIcon} />
        </div>
      )}
    </>
  );

  const containerClassName = `${styles.container}${className ? ` ${className}` : ''}`;

  if (href) {
    return (
      <a
        href={href}
        target="_blank"
        rel="noreferrer"
        className={`${containerClassName} ${styles.link}`}
      >
        {avatarContent}
      </a>
    );
  }

  return <div className={containerClassName}>{avatarContent}</div>;
};

export default Avatar;
