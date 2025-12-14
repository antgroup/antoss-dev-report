import React from 'react';

import styles from './index.module.scss';

interface PageWithBarProps {
  style?: React.CSSProperties;
  className?: string;
  children: React.ReactNode;
}

const PageWithBar = React.forwardRef<HTMLDivElement, PageWithBarProps>(
  ({ style, className, children }, ref) => {
    return (
      <div ref={ref} className={`${styles.pageWithBar} ${className}`} style={style}>
        {/* page bar */}
        <svg
          className={styles.svg}
          viewBox="0 0 654 87"
          preserveAspectRatio="none"
          version="1.1"
          xmlns="http://www.w3.org/2000/svg"
        >
          <title>编组</title>
          <defs>
            <linearGradient
              x1="44.4343028%"
              y1="0.958795939%"
              x2="58.5221517%"
              y2="101.872266%"
              id="linearGradient-1"
            >
              <stop stopColor="#FFFFFF" offset="0%" />
              <stop stopColor="#FEFEFE" offset="57.9652382%" />
              <stop stopColor="#E0E0E0" offset="100%" />
            </linearGradient>
          </defs>
          <g id="页面-1" stroke="none" strokeWidth="1" fill="none" fillRule="evenodd">
            <g id="xxx">
              <g id="编组">
                <line
                  x1="0"
                  y1="38.2783401"
                  x2="652.292511"
                  y2="38.2783401"
                  id="路径"
                  stroke="#000000"
                  strokeWidth="5.20157133"
                />
                <line
                  x1="0"
                  y1="84.0521678"
                  x2="652.292511"
                  y2="84.0521678"
                  id="路径备份-3"
                  stroke="#000000"
                  strokeWidth="5.20157133"
                />
                <g transform="translate(0, 0.1193)" stroke="#000000">
                  <rect
                    id="矩形-3"
                    strokeWidth="2.50470569"
                    fill="#C2C5CC"
                    x="1.25235284"
                    y="1.25235284"
                    width="34.9466079"
                    height="34.9466079"
                  />
                  <rect
                    id="矩形-4"
                    strokeWidth="1.25235284"
                    fill="#FFFFFF"
                    x="10.1082765"
                    y="16.3118248"
                    width="19.023836"
                    height="3.93596608"
                  />
                </g>
                <g transform="translate(615.866, 0.1193)">
                  <rect
                    id="矩形-3备份"
                    stroke="#000000"
                    strokeWidth="2.50470569"
                    fill="#C2C5CC"
                    x="1.25235284"
                    y="1.25235284"
                    width="35.0658796"
                    height="35.0658796"
                  />
                  <rect
                    id="矩形-5"
                    fill="#FFFFFF"
                    x="2.50470569"
                    y="2.50470569"
                    width="32.5611739"
                    height="2.50470569"
                  />
                  <rect
                    id="矩形-5备份"
                    fill="#87888C"
                    x="2.50470569"
                    y="33.8135268"
                    width="32.5611739"
                    height="2.50470569"
                  />
                  <polygon
                    id="矩形-5备份-2"
                    fill="#87888C"
                    transform="translate(33.8135, 19.4115) rotate(90) translate(-33.8135, -19.4115)"
                    points="16.9067634 18.1591162 50.7202902 18.1591162 50.7202902 20.6638219 16.9067634 20.6638219"
                  />
                  <rect
                    id="矩形-5"
                    fill="#FFFFFF"
                    x="2.50470569"
                    y="2.50470569"
                    width="2.50470569"
                    height="28.8041154"
                  />
                  <path
                    d="M21.222411,16.2289026 L21.2217712,17.9999026 L23.1798957,17.9999534 L23.1798957,20.1494377 L24.7677688,20.1494377 L24.7677688,22.0386786 L26.1903261,22.0386786 L26.1903261,23.645614 L27.4642966,23.645614 L27.4642966,24.9241993 L21.2217712,24.9549026 L21.222411,24.9675424 L19.9737712,24.9609026 L18.7256568,24.9675424 L18.7247712,24.9549026 L12.4837712,24.9241993 L12.4837712,23.645614 L13.7577417,23.645614 L13.7577417,22.0386786 L15.1802991,22.0386786 L15.1802991,20.1494377 L16.7681722,20.1494377 L16.7681722,17.9999534 L18.7247712,17.9999026 L18.7256568,16.2289026 L21.222411,16.2289026 Z"
                    id="形状结合"
                    fill="#000000"
                  />
                </g>
                <g
                  id="编组备份"
                  transform="translate(597.2, 18.7853) scale(1, -1) translate(-597.2, -18.7853)translate(578.4147, 0)"
                >
                  <rect
                    id="矩形-3备份"
                    stroke="#000000"
                    strokeWidth="2.50470569"
                    fill="#C2C5CC"
                    x="1.25235284"
                    y="1.25235284"
                    width="35.0658796"
                    height="35.0658796"
                  />
                  <rect
                    id="矩形-5"
                    fill="#FFFFFF"
                    x="2.50470569"
                    y="2.50470569"
                    width="32.5611739"
                    height="2.50470569"
                  />
                  <rect
                    id="矩形-5备份"
                    fill="#87888C"
                    x="2.50470569"
                    y="33.8135268"
                    width="32.5611739"
                    height="2.50470569"
                  />
                  <polygon
                    id="矩形-5备份-2"
                    fill="#87888C"
                    transform="translate(33.8135, 19.4115) rotate(90) translate(-33.8135, -19.4115)"
                    points="16.9067634 18.1591162 50.7202902 18.1591162 50.7202902 20.6638219 16.9067634 20.6638219"
                  />
                  <rect
                    id="矩形-5"
                    fill="#FFFFFF"
                    x="2.50470569"
                    y="2.50470569"
                    width="2.50470569"
                    height="28.8041154"
                  />
                  <path
                    d="M21.222411,16.2289026 L21.2217712,17.9999026 L23.1798957,17.9999534 L23.1798957,20.1494377 L24.7677688,20.1494377 L24.7677688,22.0386786 L26.1903261,22.0386786 L26.1903261,23.645614 L27.4642966,23.645614 L27.4642966,24.9241993 L21.2217712,24.9549026 L21.222411,24.9675424 L19.9737712,24.9609026 L18.7256568,24.9675424 L18.7247712,24.9549026 L12.4837712,24.9241993 L12.4837712,23.645614 L13.7577417,23.645614 L13.7577417,22.0386786 L15.1802991,22.0386786 L15.1802991,20.1494377 L16.7681722,20.1494377 L16.7681722,17.9999534 L18.7247712,17.9999026 L18.7256568,16.2289026 L21.222411,16.2289026 Z"
                    id="形状结合"
                    fill="#000000"
                  />
                </g>
              </g>
            </g>
          </g>
        </svg>
        {/* page content */}
        {children}
      </div>
    );
  },
);

PageWithBar.displayName = 'PageWithBar';

export default PageWithBar;
