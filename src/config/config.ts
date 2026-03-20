import { z } from 'zod';
import dotenv from 'dotenv';

dotenv.config();

const ConfigSchema = z.object({
  nodeEnv: z.enum(['development', 'production', 'test']).default('development'),
  port: z.number().int().positive().default(8003),
  logLevel: z.enum(['debug', 'info', 'warn', 'error']).default('info'),
  
  playwright: z.object({
    headless: z.boolean().default(false),
    timeout: z.number().int().positive().default(30000),
    viewport: z.object({
      width: z.number().int().positive().default(1920),
      height: z.number().int().positive().default(1080),
    }),
    locale: z.string().default('zh-CN'),
  }),
  
  image: z.object({
    maxSize: z.number().int().positive().default(1048576),
    quality: z.number().int().min(1).max(100).default(80),
    supportedFormats: z.array(z.string()).default(['jpg', 'jpeg', 'png', 'gif', 'webp']),
  }),
  
  paths: z.object({
    dataDir: z.string().default('./data'),
    cookiesFile: z.string().default('./data/cookies.json'),
    downloadDir: z.string().default('./downloads'),
    traceDir: z.string().default('./traces'),
  }),
  
  toutiao: z.object({
    urls: z.object({
      login: z.string().url().default('https://sso.toutiao.com/login'),
      homepage: z.string().url().default('https://mp.toutiao.com/profile_v4'),
      publishArticle: z.string().url().default('https://mp.toutiao.com/profile_v4/graphic/publish'),
      publishMicro: z.string().url().default('https://mp.toutiao.com/profile_v4/weitoutiao/publish'),
      analytics: z.string().url().default('https://mp.toutiao.com/profile_v4/data'),
    }),
    loginTimeout: z.number().int().positive().default(300000),
    publishDelay: z.number().int().nonnegative().default(2000),
  }),
});

type Config = z.infer<typeof ConfigSchema>;

class ConfigManager {
  private static instance: ConfigManager;
  private config: Config;

  private constructor() {
    this.config = this.loadConfig();
  }

  static getInstance(): ConfigManager {
    if (!ConfigManager.instance) {
      ConfigManager.instance = new ConfigManager();
    }
    return ConfigManager.instance;
  }

  private loadConfig(): Config {
    const rawConfig = {
      nodeEnv: process.env.NODE_ENV as 'development' | 'production' | 'test' | undefined,
      port: process.env.PORT ? parseInt(process.env.PORT, 10) : undefined,
      logLevel: process.env.LOG_LEVEL as 'debug' | 'info' | 'warn' | 'error' | undefined,
      
      playwright: {
        headless: process.env.PLAYWRIGHT_HEADLESS === 'true',
        timeout: process.env.PLAYWRIGHT_TIMEOUT ? parseInt(process.env.PLAYWRIGHT_TIMEOUT, 10) : undefined,
        viewport: {
          width: process.env.PLAYWRIGHT_VIEWPORT_WIDTH ? parseInt(process.env.PLAYWRIGHT_VIEWPORT_WIDTH, 10) : undefined,
          height: process.env.PLAYWRIGHT_VIEWPORT_HEIGHT ? parseInt(process.env.PLAYWRIGHT_VIEWPORT_HEIGHT, 10) : undefined,
        },
        locale: process.env.PLAYWRIGHT_LOCALE,
      },
      
      image: {
        maxSize: process.env.IMAGE_MAX_SIZE ? parseInt(process.env.IMAGE_MAX_SIZE, 10) : undefined,
        quality: process.env.IMAGE_QUALITY ? parseInt(process.env.IMAGE_QUALITY, 10) : undefined,
        supportedFormats: process.env.IMAGE_FORMATS?.split(','),
      },
      
      paths: {
        dataDir: process.env.DATA_DIR,
        cookiesFile: process.env.COOKIES_FILE,
        downloadDir: process.env.DOWNLOAD_DIR,
        traceDir: process.env.TRACE_DIR,
      },
      
      toutiao: {
        urls: {
          login: process.env.TOUTIAO_LOGIN_URL,
          homepage: process.env.TOUTIAO_HOMEPAGE_URL,
          publishArticle: process.env.TOUTIAO_PUBLISH_ARTICLE_URL,
          publishMicro: process.env.TOUTIAO_PUBLISH_MICRO_URL,
          analytics: process.env.TOUTIAO_ANALYTICS_URL,
        },
        loginTimeout: process.env.TOUTIAO_LOGIN_TIMEOUT ? parseInt(process.env.TOUTIAO_LOGIN_TIMEOUT, 10) : undefined,
        publishDelay: process.env.TOUTIAO_PUBLISH_DELAY ? parseInt(process.env.TOUTIAO_PUBLISH_DELAY, 10) : undefined,
      },
    };

    return ConfigSchema.parse(rawConfig);
  }

  get(): Config {
    return this.config;
  }

  reload(): void {
    this.config = this.loadConfig();
  }
}

export const config = ConfigManager.getInstance().get();
export type { Config };
