import fs from 'fs-extra';
import path from 'path';
import type { Cookie } from 'playwright';
import { logger } from '../utils/logger.js';
import { PATHS } from '../utils/constants.js';

export class CookieManager {
  private cookiePath: string;

  constructor(cookiePath?: string) {
    this.cookiePath = cookiePath || PATHS.cookiesFile;
  }

  async saveCookies(cookies: Cookie[]): Promise<void> {
    try {
      await fs.ensureDir(path.dirname(this.cookiePath));
      await fs.writeJson(
        this.cookiePath,
        {
          cookies,
          timestamp: Date.now(),
        },
        { spaces: 2 }
      );
      logger.info(`已保存 ${cookies.length} 个 Cookie`);
    } catch (error) {
      logger.error('保存 Cookie 失败', error);
      throw error;
    }
  }

  async loadCookies(): Promise<Cookie[] | null> {
    try {
      if (await fs.pathExists(this.cookiePath)) {
        const data = await fs.readJson(this.cookiePath);
        logger.info(`已加载 ${data.cookies?.length || 0} 个 Cookie`);
        return data.cookies || null;
      }
    } catch (error) {
      logger.error('加载 Cookie 失败', error);
    }
    return null;
  }

  async clearCookies(): Promise<void> {
    try {
      if (await fs.pathExists(this.cookiePath)) {
        await fs.remove(this.cookiePath);
        logger.info('已清除 Cookie');
      }
    } catch (error) {
      logger.error('清除 Cookie 失败', error);
      throw error;
    }
  }

  async hasCookies(): Promise<boolean> {
    return await fs.pathExists(this.cookiePath);
  }
}
