import { AuthService } from '../src/auth/auth.service.js';
import { MultiPlatformService } from '../src/multi-platform/multi-platform.service.js';
import { logger } from '../src/utils/logger.js';

async function main() {
  logger.info('=== 多平台发布示例 ===\n');

  // 1. 初始化服务
  const authService = new AuthService();
  const multiPlatformService = new MultiPlatformService();

  // 2. 检查登录状态
  const isLoggedIn = await authService.checkLoginStatus();
  if (!isLoggedIn) {
    logger.error('请先登录！运行: npm run dev 然后调用 login_with_credentials');
    process.exit(1);
  }

  // 3. 准备小红书格式的数据
  const xiaohongshuRecords = [
    {
      小红书标题: '今日头条自动化发布工具 🚀',
      仿写小红书文案: `
分享一个超好用的今日头条自动化发布工具！

✨ 主要功能：
• 自动登录管理
• 一键发布文章
• 批量内容处理
• 数据分析统计

🎯 适用场景：
• 自媒体运营
• 内容批量发布
• 多平台管理

💡 使用体验：
界面简洁，操作方便，大大提高了工作效率！

#自媒体运营 #效率工具 #今日头条
      `.trim(),
      配图: 'https://example.com/image1.jpg',
    },
    {
      小红书标题: 'Node.js + Playwright 实现浏览器自动化',
      仿写小红书文案: `
用 Node.js 和 Playwright 实现浏览器自动化，太香了！

🔥 技术栈：
• Node.js + TypeScript
• Playwright 浏览器自动化
• Fastify Web 框架
• MCP 协议

⚡ 核心优势：
• 自动等待机制
• 跨浏览器支持
• 强大的调试工具
• 性能优秀

📝 实战应用：
• 自动化测试
• 数据采集
• 内容发布

代码开源，欢迎使用！

#前端开发 #自动化 #Playwright
      `.trim(),
      配图: 'https://example.com/image2.jpg',
    },
  ];

  // 4. 批量发布
  logger.info(`准备发布 ${xiaohongshuRecords.length} 条内容...\n`);

  const result = await multiPlatformService.publishBatch(
    xiaohongshuRecords,
    './downloads'
  );

  // 5. 显示结果
  logger.info('\n=== 发布结果 ===');
  logger.info(`总记录数: ${result.summary.totalRecords}`);
  logger.info(`成功: ${result.summary.successCount}`);
  logger.info(`失败: ${result.summary.failedCount}`);
  logger.info(`成功率: ${result.summary.successRate}%`);

  logger.info('\n详细结果:');
  result.details.forEach((detail) => {
    const status = detail.publishResult.success ? '✓' : '✗';
    logger.info(`${status} [${detail.index}] ${detail.title}`);
    if (!detail.publishResult.success) {
      logger.info(`  错误: ${detail.publishResult.message}`);
    }
  });

  logger.info('\n=== 示例完成 ===');
}

main().catch((error) => {
  logger.error('示例执行失败', error);
  process.exit(1);
});
