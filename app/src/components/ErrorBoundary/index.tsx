import { Component, ErrorInfo, ReactNode } from 'react';
import ComputerTopLayout from '@/layouts/ComputerTopLayout';
import { PageId } from '@/pages/types';

import styles from './index.module.scss';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
  pageId: PageId;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
    };
  }

  static getDerivedStateFromError(error: Error): State {
    return {
      hasError: true,
      error,
    };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <ComputerTopLayout
          name={this.props.pageId}
          screenContent={
            <div className={styles.screenContent}>
              <div>抱歉，当前页面</div>
              <div>
                <span className={styles.pageId}>{this.props.pageId}</span>
              </div>
              <div>数据缺失了</div>
            </div>
          }
          paperContent={
            <div className={styles.paperContent}>
              {this.state.error && (
                <div className={styles.errorDetails}>
                  <div className={styles.errorTitle}>错误原因：</div>
                  <div className={styles.errorText}>
                    {this.state.error.message || this.state.error.toString()}
                  </div>
                </div>
              )}
              <div className={styles.issueSection}>
                <a
                  href="https://github.com/antgroup/antoss-dev-report/issues"
                  target="_blank"
                  rel="noreferrer"
                  className={styles.issueLink}
                >
                  提交 Issue
                </a>
              </div>
            </div>
          }
        />
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
