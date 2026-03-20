import { chromium, Browser, BrowserContext } from 'playwright';
import { logger } from './logger.js';
import { config } from '../config/config.js';

export class BrowserPool {
  private static instance: BrowserPool;
  private browser: Browser | null = null;
  private contexts: Set<BrowserContext> = new Set();
  private isInitialized = false;

  private constructor() {}

  static getInstance(): BrowserPool {
    if (!BrowserPool.instance) {
      BrowserPool.instance = new BrowserPool();
    }
    return BrowserPool.instance;
  }

  async initialize(): Promise<void> {
    if (this.isInitialized) {
      return;
    }

    try {
      this.browser = await chromium.launch({
        headless: config.playwright.headless,
      });
      this.isInitialized = true;
      logger.info('浏览器池已初始化');
    } catch (error) {
      logger.error('浏览器池初始化失败', error);
      throw error;
    }
  }

  async getContext(options?: Parameters<Browser['newContext']>[0]): Promise<BrowserContext> {
    if (!this.browser) {
      await this.initialize();
    }

    const context = await this.browser!.newContext({
      locale: config.playwright.locale,
      viewport: config.playwright.viewport,
      ...options,
    });

    this.contexts.add(context);
    return context;
  }

  async releaseContext(context: BrowserContext): Promise<void> {
    try {
      await context.close();
      this.contexts.delete(context);
    } catch (error) {
      logger.error('关闭浏览器上下文失败', error);
    }
  }

  async cleanup(): Promise<void> {
    for (const context of this.contexts) {
      await this.releaseContext(context);
    }

    if (this.browser) {
      await this.browser.close();
      this.browser = null;
      this.isInitialized = false;
      logger.info('浏览器池已清理');
    }
  }

  async restart(): Promise<void> {
    await this.cleanup();
    await this.initialize();
  }
}

export const browserPool = BrowserPool.getInstance();
