// 资源管理器 - 单例模式
export interface ResourceItem {
  type: 'image' | 'font';
  url: string;
  name?: string;
}

export interface LoadProgress {
  loaded: number;
  total: number;
  percentage: number;
}

type ProgressCallback = (progress: LoadProgress) => void;

class ResourceManager {
  private static instance: ResourceManager;

  static getInstance(): ResourceManager {
    if (!ResourceManager.instance) {
      ResourceManager.instance = new ResourceManager();
    }
    return ResourceManager.instance;
  }

  private resources: Map<string, ResourceItem> = new Map();
  private isPreloading = false;
  private preloadPromise: Promise<void> | null = null;

  // 使用 import.meta.glob 自动收集所有图片资源
  // 使用 eager: true 在构建时内联 URL，避免生成额外的 JS 文件
  private imageModules = import.meta.glob(
    [
      // 收集所有页面和组件中的图片
      '@/pages/**/*.{png,jpg,jpeg,gif,svg}',
      '@/components/**/*.{png,jpg,jpeg,gif,svg}',
    ],
    {
      eager: true, // 构建时内联，不生成单独的 JS 文件
      import: 'default',
      query: '?url', // 获取资源的 URL
    },
  );

  getAllResources(): ResourceItem[] {
    return Array.from(this.resources.values());
  }

  /**
   * 收集并注册所有图片资源
   * 这个函数在应用初始化时调用，不依赖组件渲染
   */
  async collectAllImageResources(): Promise<void> {
    // 使用 eager: true 时，imageModules 的值已经是 URL 字符串，而不是函数
    Object.entries(this.imageModules).forEach(([path, urlOrModule]) => {
      try {
        // eager: true 时，值直接是 URL 字符串
        const url =
          typeof urlOrModule === 'string'
            ? urlOrModule
            : (urlOrModule as { default: string }).default;
        // 从路径中提取名称
        const name =
          path
            .split('/')
            .pop()
            ?.replace(/\.(png|jpg|jpeg|gif|svg)$/, '') || 'unknown';
        this.registerImage(url, name);
      } catch (error) {
        // 打印错误信息，但不阻塞收集过程
        // eslint-disable-next-line no-console
        console.error(`[ResourceManager] 收集图片资源失败: ${path}`, {
          path,
          error: error instanceof Error ? error.message : String(error),
        });
      }
    });
  }

  /**
   * 注册字体资源（硬编码）
   */
  registerFontResources(): void {
    this.registerFont(`${import.meta.env.BASE_PATH}fonts/04b_03.ttf`, '04b_03');
    this.registerFont(`${import.meta.env.BASE_PATH}fonts/DingTalk-JinBuTi.ttf`, 'DingTalk-JinBuTi');
    this.registerFont(
      `${import.meta.env.BASE_PATH}fonts/AlibabaPuHuiTi-3-55-Regular.ttf`,
      'AlibabaPuHuiTi-3',
    );
    this.registerFont(
      `${import.meta.env.BASE_PATH}fonts/AlibabaPuHuiTi-3-85-Bold.ttf`,
      'AlibabaPuHuiTi-3-Bold',
    );
    this.registerFont(`${import.meta.env.BASE_PATH}fonts/Supermagnet-Fat.ttf`, 'Supermagnet-Fat');
  }

  /**
   * 注册 CSS 中使用的资源（如果有的话）
   */
  async registerCssResources(): Promise<void> {
    // 如果 CSS 中有背景图，可以在这里导入并注册
    try {
      // 例如：page-background.png
      // const pageBackgroundModule = await import(
      //   '@/layouts/BaseLayout/assets/page-background.png?url'
      // );
      // this.registerImage(pageBackgroundModule.default, 'page-background');
    } catch (error) {
      // 打印错误信息，但不阻塞注册过程
      // eslint-disable-next-line no-console
      console.error('[ResourceManager] 注册 CSS 资源失败: page-background.png', {
        error: error instanceof Error ? error.message : String(error),
      });
    }
  }

  async preloadAll(onProgress?: ProgressCallback): Promise<void> {
    if (this.isPreloading && this.preloadPromise) {
      return this.preloadPromise;
    }
    if (this.preloadPromise && !this.isPreloading) {
      return Promise.resolve();
    }

    this.isPreloading = true;

    this.preloadPromise = (async () => {
      const resources = this.getAllResources();
      const total = resources.length;
      let loaded = 0;

      if (total === 0) {
        this.isPreloading = false;
        return;
      }

      const updateProgress = () => {
        loaded++;
        const percentage = Math.round((loaded / total) * 100);
        onProgress?.({ loaded, total, percentage });
      };

      const promises = resources.map(async (resource) => {
        try {
          if (resource.type === 'image') {
            await this.loadImage(resource.url);
          } else if (resource.type === 'font') {
            await this.loadFont(resource.name || 'This-Is-A-Font', resource.url);
          }
        } catch (error) {
          // 打印详细的错误信息，但不阻塞进度
          // eslint-disable-next-line no-console
          console.error(
            `[ResourceManager] 资源加载失败: ${resource.type} - ${resource.name || resource.url}`,
            {
              url: resource.url,
              name: resource.name,
              type: resource.type,
              error: error instanceof Error ? error.message : String(error),
            },
          );
        } finally {
          // 无论成功还是失败，都更新进度，确保不会阻塞
          updateProgress();
        }
      });

      await Promise.all(promises);
      this.isPreloading = false;
    })();

    return this.preloadPromise;
  }

  clear(): void {
    this.resources.clear();
    this.isPreloading = false;
    this.preloadPromise = null;
  }

  // 注册图片资源（自动去重）
  registerImage(url: string, name?: string): void {
    const key = url;
    if (!this.resources.has(key)) {
      this.resources.set(key, {
        type: 'image',
        url,
        name: name || this.extractNameFromUrl(url),
      });
    }
  }

  // 注册字体资源
  registerFont(url: string, fontFamily: string): void {
    const key = `font:${fontFamily}:${url}`;
    if (!this.resources.has(key)) {
      this.resources.set(key, {
        type: 'font',
        url,
        name: fontFamily,
      });
    }
  }

  // 批量注册图片资源
  registerImages(urls: Array<string | { url: string; name?: string }>): void {
    urls.forEach((item) => {
      if (typeof item === 'string') {
        this.registerImage(item);
      } else {
        this.registerImage(item.url, item.name);
      }
    });
  }

  private extractNameFromUrl(url: string): string {
    const match = url.match(/([^/]+)\.(png|jpg|jpeg|gif|svg)/);
    return match ? match[1] : 'unknown';
  }

  private loadImage(url: string): Promise<void> {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => resolve();
      img.onerror = () => reject(new Error(`Failed to load image: ${url}`));
      img.src = url;
      if (img.complete) {
        resolve();
      }
    });
  }

  private async loadFont(fontFamily: string, url: string): Promise<void> {
    if (document.fonts.check(`1em "${fontFamily}"`)) {
      return Promise.resolve();
    }
    try {
      const font = new FontFace(fontFamily, `url(${url})`);
      await font.load();
      document.fonts.add(font);
    } catch (error) {
      // 字体加载失败时，尝试等待 document.fonts.ready
      // 如果仍然失败，会在 preloadAll 的 catch 中打印错误
      try {
        await document.fonts.ready;
      } catch (readyError) {
        // 如果 ready 也失败，抛出错误以便在 preloadAll 中处理
        throw new Error(
          `Font loading failed: ${fontFamily} from ${url}. Original error: ${
            error instanceof Error ? error.message : String(error)
          }`,
        );
      }
    }
  }
}

export const resourceManager = ResourceManager.getInstance();
