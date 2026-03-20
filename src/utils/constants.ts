export const TOUTIAO_URLS = {
  login: 'https://sso.toutiao.com/login',
  homepage: 'https://mp.toutiao.com/profile_v4',
  publishArticle: 'https://mp.toutiao.com/profile_v4/graphic/publish',
  publishMicro: 'https://mp.toutiao.com/profile_v4/weitoutiao/publish',
  analytics: 'https://mp.toutiao.com/profile_v4/data',
};

export const PLAYWRIGHT_CONFIG = {
  headless: process.env.PLAYWRIGHT_HEADLESS === 'true',
  timeout: parseInt(process.env.PLAYWRIGHT_TIMEOUT || '30000', 10),
  viewport: {
    width: parseInt(process.env.PLAYWRIGHT_VIEWPORT_WIDTH || '1920', 10),
    height: parseInt(process.env.PLAYWRIGHT_VIEWPORT_HEIGHT || '1080', 10),
  },
  locale: 'zh-CN',
};

export const IMAGE_CONFIG = {
  maxSize: parseInt(process.env.IMAGE_MAX_SIZE || '1048576', 10),
  quality: parseInt(process.env.IMAGE_QUALITY || '80', 10),
  supportedFormats: ['jpg', 'jpeg', 'png', 'gif', 'webp'],
};

export const PATHS = {
  dataDir: process.env.DATA_DIR || './data',
  cookiesFile: process.env.COOKIES_FILE || './data/cookies.json',
  downloadDir: process.env.DOWNLOAD_DIR || './downloads',
  traceDir: process.env.TRACE_DIR || './traces',
};
