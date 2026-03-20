import { ToutiaoMCPServer } from './server.js';
import { logger } from './utils/logger.js';
import dotenv from 'dotenv';

dotenv.config();

async function main() {
  try {
    logger.info('正在启动今日头条 MCP 服务器...');
    
    const server = new ToutiaoMCPServer();
    await server.start();
    
    logger.info('今日头条 MCP 服务器已成功启动');
  } catch (error) {
    logger.error('服务器启动失败', error);
    process.exit(1);
  }
}

main();
