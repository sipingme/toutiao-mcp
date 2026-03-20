import { BrowserContext } from 'playwright';
import { CookieManager } from './cookie.manager.js';
import { logger } from '../utils/logger.js';
import { config } from '../config/config.js';
import { browserPool } from '../utils/browser-pool.js';
import { AuthenticationError, TimeoutError } from '../utils/errors.js';
import { withTimeout } from '../utils/retry.js';
import type { LoginResult, UserInfo } from '../types/index.js';

export class AuthService {
  private cookieManager: CookieManager;

  constructor() {
    this.cookieManager = new CookieManager();
  }

  async login(username?: string, password?: string): Promise<LoginResult> {
    let context: BrowserContext | null = null;

    try {
      context = await browserPool.getContext();
      const page = await context.newPage();

      logger.info('正在打开今日头条登录页面...');
      await page.goto(config.toutiao.urls.login);

      logger.info('请在浏览器中完成登录...');
      this.printLoginInstructions();

      // 等待登录成功跳转（带超时控制）
      await withTimeout(
        page.waitForURL(/mp\.toutiao\.com|creator\.toutiao\.com/),
        config.toutiao.loginTimeout,
        '登录超时，请重试'
      );

      logger.info('检测到登录成功');

      // 保存 Cookie
      const cookies = await context.cookies();
      await this.cookieManager.saveCookies(cookies);

      return {
        success: true,
        message: '登录成功',
      };
    } catch (error) {
      logger.error('登录失败', error);
      
      if (error instanceof Error && error.message.includes('超时')) {
        throw new TimeoutError('登录超时', { originalError: error });
      }
      
      throw new AuthenticationError('登录失败', { originalError: error });
    } finally {
      if (context) {
        await browserPool.releaseContext(context);
      }
    }
  }

  async checkLoginStatus(): Promise<boolean> {
    const cookies = await this.cookieManager.loadCookies();

    if (!cookies || cookies.length === 0) {
      logger.info('未找到 Cookie，需要登录');
      return false;
    }

    let context: BrowserContext | null = null;

    try {
      context = await browserPool.getContext();
      await context.addCookies(cookies);

      const page = await context.newPage();
      const response = await page.goto(config.toutiao.urls.homepage, {
        waitUntil: 'domcontentloaded',
        timeout: 10000,
      });

      const isLoggedIn = response?.url().includes('mp.toutiao.com') || false;

      logger.info(`登录状态: ${isLoggedIn ? '已登录' : '未登录'}`);
      return isLoggedIn;
    } catch (error) {
      logger.error('检查登录状态失败', error);
      return false;
    } finally {
      if (context) {
        await browserPool.releaseContext(context);
      }
    }
  }

  async getUserInfo(): Promise<UserInfo | null> {
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
      throw new AuthenticationError('登出失败', { originalError: error });
    }
  }

  private printLoginInstructions(): void {
    const instructions = [
      '提示：',
      '1. 使用手机号+验证码登录',
      '2. 输入手机号并获取验证码',
      '3. 输入验证码并点击登录',
      '4. 等待跳转到创作者中心',
    ];
    instructions.forEach((msg) => logger.info(msg));
  }
}
