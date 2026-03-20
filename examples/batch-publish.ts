import { AuthService } from '../src/auth/auth.service.js';
import { ArticlePublisher } from '../src/publisher/article.publisher.js';
import { logger } from '../src/utils/logger.js';

async function main() {
  logger.info('=== 批量发布示例 ===\n');

  const authService = new AuthService();
  const articlePublisher = new ArticlePublisher();

  // 检查登录
  const isLoggedIn = await authService.checkLoginStatus();
  if (!isLoggedIn) {
    logger.error('请先登录！');
    process.exit(1);
  }

  // 准备批量文章数据
  const articles = [
    {
      title: 'AI 技术发展趋势 2026',
      content: '人工智能技术在 2026 年将迎来新的突破...',
      tags: ['AI', '科技', '趋势'],
    },
    {
      title: 'Node.js 性能优化实践',
      content: '分享一些 Node.js 性能优化的实用技巧...',
      tags: ['Node.js', '性能优化', '后端'],
    },
    {
      title: 'TypeScript 最佳实践',
      content: 'TypeScript 在大型项目中的应用经验...',
      tags: ['TypeScript', '前端', '最佳实践'],
    },
  ];

  logger.info(`准备发布 ${articles.length} 篇文章...\n`);

  const results = [];

  for (let i = 0; i < articles.length; i++) {
    const article = articles[i];
    logger.info(`[${i + 1}/${articles.length}] 发布: ${article.title}`);

    try {
      const result = await articlePublisher.publish({
        ...article,
        original: true,
      });

      results.push({
        title: article.title,
        success: result.success,
        message: result.message,
      });

      if (result.success) {
        logger.info(`✓ 发布成功`);
      } else {
        logger.error(`✗ 发布失败: ${result.message}`);
      }

      // 避免请求过于频繁
      if (i < articles.length - 1) {
        logger.info('等待 3 秒...\n');
        await new Promise((resolve) => setTimeout(resolve, 3000));
      }
    } catch (error) {
      logger.error(`✗ 发布异常`, error);
      results.push({
        title: article.title,
        success: false,
        message: `异常: ${error}`,
      });
    }
  }

  // 统计结果
  const successCount = results.filter((r) => r.success).length;
  const failedCount = results.length - successCount;

  logger.info('\n=== 批量发布完成 ===');
  logger.info(`总数: ${results.length}`);
  logger.info(`成功: ${successCount}`);
  logger.info(`失败: ${failedCount}`);
  logger.info(`成功率: ${Math.round((successCount / results.length) * 100)}%`);
}

main().catch((error) => {
  logger.error('批量发布失败', error);
  process.exit(1);
});
