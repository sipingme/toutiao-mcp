import { AuthService } from '../src/auth/auth.service.js';
import { ArticlePublisher } from '../src/publisher/article.publisher.js';
import { logger } from '../src/utils/logger.js';

async function main() {
  logger.info('=== 今日头条 MCP 服务器基础使用示例 ===\n');

  // 1. 初始化服务
  const authService = new AuthService();
  const articlePublisher = new ArticlePublisher();

  // 2. 检查登录状态
  logger.info('检查登录状态...');
  const isLoggedIn = await authService.checkLoginStatus();

  if (!isLoggedIn) {
    logger.info('未登录，开始登录流程...');
    const loginResult = await authService.login();
    
    if (!loginResult.success) {
      logger.error('登录失败，退出');
      process.exit(1);
    }
    
    logger.info('登录成功！');
  } else {
    logger.info('已登录');
  }

  // 3. 发布文章示例
  logger.info('\n开始发布文章...');
  
  const articleData = {
    title: '今日头条 MCP 服务器使用指南',
    content: `
# 什么是 MCP 服务器？

MCP（Model Context Protocol）服务器是一种标准化的协议，用于连接 AI 模型和外部工具。

## 主要特性

1. 自动化内容发布
2. 多平台兼容
3. 数据分析统计

## 使用场景

- 批量内容发布
- 自动化运营
- 数据驱动决策

欢迎使用今日头条 MCP 服务器！
    `.trim(),
    images: [], // 如果有图片，添加路径
    tags: ['科技', 'MCP', '自动化'],
    original: true,
  };

  const publishResult = await articlePublisher.publish(articleData);

  if (publishResult.success) {
    logger.info('✓ 文章发布成功！');
  } else {
    logger.error(`✗ 文章发布失败: ${publishResult.message}`);
  }

  logger.info('\n=== 示例完成 ===');
}

main().catch((error) => {
  logger.error('示例执行失败', error);
  process.exit(1);
});
