import { chromium, Browser, BrowserContext, Page } from 'playwright';
import { CookieManager } from './cookie.manager.js';
import { logger } from '../utils/logger.js';
import { TOUTIAO_URLS, PLAYWRIGHT_CONFIG } from '../utils/constants.js';
import type { LoginResult, UserInfo } from '../types/index.js';

export class AuthService {
  private cookieManager: CookieManager;

  constructor() {
    this.cookieManager = new CookieManager();
  }

  async login(username?: string, password?: string): Promise<LoginResult> {
    let browser: Browser | null = null;

    try {
      browser = await chromium.launch({
        headless: PLAYWRIGHT_CONFIG.headless,
      });

      const context = await browser.newContext({
        locale: PLAYWRIGHT_CONFIG.locale,
        viewport: PLAYWRIGHT_CONFIG.viewport,
      });

      const page = await context.newPage();
      
      logger.info('正在打开今日头条登录页面...');
      await page.goto(TOUTIAO_URLS.login);

      logger.info('请在浏览器中完成登录...');
      logger.info('提示：');
      logger.info('1. 使用手机号+验证码登录');
      logger.info('2. 输入手机号并获取验证码');
      logger.info('3. 输入验证码并点击登录');
      logger.info('4. 等待跳转到创作者中心');

      // 等待登录成功跳转
      await page.waitForURL(/mp\.toutiao\.com|creator\.toutiao\.com/, {
        timeout: 300000, // 5分钟
      });

      logger.info('检测到登录成功');

      // 保存 Cookie
      const cookies = await context.cookies();
      await this.cookieManager.saveCookies(cookies);

      await browser.close();

      return {
        success: true,
        message: '登录成功',
      };
    } catch (error) {
      logger.error('登录失败', error);
      if (browser) {
        await browser.close();
      }
      return {
        success: false,
        message: `登录失败: ${error}`,
      };
    }
  }

  async checkLoginStatus(): Promise<boolean> {
    const cookies = await this.cookieManager.loadCookies();
    
    if (!cookies || cookies.length === 0) {
      logger.info('未找到 Cookie，需要登录');
      return false;
    }

    let browser: Browser | null = null;

    try {
      browser = await chromium.launch({ headless: true });
      const context = await browser.newContext();
      await context.addCookies(cookies);

      const page = await context.newPage();
      const response = await page.goto(TOUTIAO_URLS.homepage, {
        waitUntil: 'domcontentloaded',
        timeout: 10000,
      });

      const isLoggedIn = response?.url().includes('mp.toutiao.com') || false;
      
      await browser.close();
      
      logger.info(`登录状态: ${isLoggedIn ? '已登录' : '未登录'}`);
      return isLoggedIn;
    } catch (error) {
      logger.error('检查登录状态失败', error);
      if (browser) {
        await browser.close();
      }
      return false;
    }
  }

  async getUserInfo(): Promise<UserInfo | null> {
    // TODO: 实现用户信息获取
    logger.warn('getUserInfo 功能待实现');
    return null;
  }

  async logout(): Promise<boolean> {
    try {
      await this.cookieManager.clearCookies();
      logger.info('已登出');
      return true;
    } catch (error) {
      logger.error('登出失败', error);
      return false;
    }
  }
}
