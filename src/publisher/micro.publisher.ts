import { chromium, Browser } from 'playwright';
import { CookieManager } from '../auth/cookie.manager.js';
import { logger } from '../utils/logger.js';
import { TOUTIAO_URLS, PLAYWRIGHT_CONFIG } from '../utils/constants.js';
import type { MicroPostData, PublishResult } from '../types/index.js';

export class MicroPublisher {
  private cookieManager: CookieManager;

  constructor() {
    this.cookieManager = new CookieManager();
  }

  async publish(data: MicroPostData): Promise<PublishResult> {
    let browser: Browser | null = null;

    try {
      const cookies = await this.cookieManager.loadCookies();
      
      if (!cookies) {
        return {
          success: false,
          message: '请先登录',
        };
      }

      logger.info('开始发布微头条...');

      browser = await chromium.launch({
        headless: PLAYWRIGHT_CONFIG.headless,
      });

      const context = await browser.newContext({
        locale: PLAYWRIGHT_CONFIG.locale,
        viewport: PLAYWRIGHT_CONFIG.viewport,
      });

      await context.addCookies(cookies);

      const page = await context.newPage();
      await page.goto(TOUTIAO_URLS.publishMicro);
      await page.waitForLoadState('networkidle');

      // 输入内容
      logger.info('输入微头条内容...');
      const contentInput = page.locator('textarea').first();
      await contentInput.fill(data.content);

      // 上传图片（如果有）
      if (data.images && data.images.length > 0) {
        logger.info(`上传 ${data.images.length} 张图片...`);
        const fileInput = page.locator('input[type="file"]');
        await fileInput.setInputFiles(data.images.slice(0, 9)); // 最多9张
      }

      // 点击发布
      logger.info('点击发布按钮...');
      await page.locator('button', { hasText: '发布' }).click();

      await page.waitForTimeout(3000);
      await browser.close();

      logger.info('微头条发布成功');
      return {
        success: true,
        message: '发布成功',
      };
    } catch (error) {
      logger.error('微头条发布失败', error);
      
      if (browser) {
        await browser.close();
      }

      return {
        success: false,
        message: `发布失败: ${error}`,
      };
    }
  }
}
