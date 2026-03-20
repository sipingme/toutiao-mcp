import { chromium, Browser, BrowserContext, Page } from 'playwright';
import path from 'path';
import { CookieManager } from '../auth/cookie.manager.js';
import { logger } from '../utils/logger.js';
import { compressImage } from '../utils/image.utils.js';
import { TOUTIAO_URLS, PLAYWRIGHT_CONFIG, PATHS } from '../utils/constants.js';
import type { ArticleData, PublishResult } from '../types/index.js';

export class ArticlePublisher {
  private cookieManager: CookieManager;

  constructor() {
    this.cookieManager = new CookieManager();
  }

  async publish(data: ArticleData): Promise<PublishResult> {
    let browser: Browser | null = null;

    try {
      const cookies = await this.cookieManager.loadCookies();
      
      if (!cookies) {
        return {
          success: false,
          message: '请先登录',
        };
      }

      logger.info(`开始发布文章: ${data.title}`);

      browser = await chromium.launch({
        headless: PLAYWRIGHT_CONFIG.headless,
      });

      const context = await browser.newContext({
        locale: PLAYWRIGHT_CONFIG.locale,
        viewport: PLAYWRIGHT_CONFIG.viewport,
      });

      await context.addCookies(cookies);

      // 启用追踪用于调试
      const tracePath = path.join(PATHS.traceDir, `publish-${Date.now()}.zip`);
      await context.tracing.start({ screenshots: true, snapshots: true });

      const page = await context.newPage();
      
      await page.goto(TOUTIAO_URLS.publishArticle);
      await page.waitForLoadState('networkidle');

      // 输入标题
      logger.info('输入标题...');
      const titleInput = page.locator('textarea[placeholder*="标题"]');
      await titleInput.fill(data.title);

      // 输入内容
      logger.info('输入内容...');
      const editor = page.locator('.ProseMirror');
      await editor.click();
      await editor.fill(data.content);

      // 上传封面图片
      if (data.images && data.images.length > 0) {
        await this.uploadCoverImage(page, data.images[0]);
      }

      // 点击发布
      logger.info('点击发布按钮...');
      await page.locator('button', { hasText: '预览并发布' }).click();
      await page.waitForTimeout(2000);

      await page.locator('button.publish-btn-last').click();

      // 等待发布成功
      try {
        await page.waitForURL(/article\/success|publish\/success/, {
          timeout: 30000,
        });
        logger.info('文章发布成功');
      } catch {
        logger.warn('未检测到成功跳转，但可能已发布成功');
      }

      await context.tracing.stop({ path: tracePath });
      await browser.close();

      return {
        success: true,
        message: '发布成功',
      };
    } catch (error) {
      logger.error('发布失败', error);
      
      if (browser) {
        await browser.close();
      }

      return {
        success: false,
        message: `发布失败: ${error}`,
      };
    }
  }

  private async uploadCoverImage(page: Page, imagePath: string): Promise<void> {
    try {
      logger.info('上传封面图片...');

      // 压缩图片
      const compressedPath = await compressImage(imagePath);

      // 点击封面上传区域
      await page.locator('.article-cover-add').click();
      await page.waitForTimeout(1000);

      // 上传图片文件
      const fileInput = page.locator('input[type="file"]').first();
      await fileInput.setInputFiles(compressedPath);

      // 等待并点击确认按钮
      const confirmButton = page.locator('button[data-e2e="imageUploadConfirm-btn"]');
      await confirmButton.waitFor({ state: 'visible', timeout: 30000 });
      await confirmButton.click();
      
      await page.waitForTimeout(2000);
      logger.info('封面图片上传完成');
    } catch (error) {
      logger.error('封面图片上传失败', error);
      throw error;
    }
  }
}
