import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from '@modelcontextprotocol/sdk/types.js';
import { AuthService } from './auth/auth.service.js';
import { ArticlePublisher } from './publisher/article.publisher.js';
import { MicroPublisher } from './publisher/micro.publisher.js';
import { AnalyticsService } from './analytics/analytics.service.js';
import { MultiPlatformService } from './multi-platform/multi-platform.service.js';
import { logger } from './utils/logger.js';
import { TOOL_DEFINITIONS } from './server/tool-definitions.js';
import { formatSuccessResponse, formatErrorResponse } from './server/response-formatter.js';
import { browserPool } from './utils/browser-pool.js';

export class ToutiaoMCPServer {
  private server: Server;
  private authService: AuthService;
  private articlePublisher: ArticlePublisher;
  private microPublisher: MicroPublisher;
  private analyticsService: AnalyticsService; // 保留供未来使用
  private multiPlatformService: MultiPlatformService;

  constructor() {
    this.server = new Server(
      {
        name: 'toutiao-mcp-server',
        version: '1.0.0',
      },
      {
        capabilities: {
          tools: {},
        },
      }
    );

    this.authService = new AuthService();
    this.articlePublisher = new ArticlePublisher();
    this.microPublisher = new MicroPublisher();
    this.analyticsService = new AnalyticsService();
    this.multiPlatformService = new MultiPlatformService();

    this.setupHandlers();
  }

  private setupHandlers() {
    this.server.setRequestHandler(ListToolsRequestSchema, async () => ({
      tools: TOOL_DEFINITIONS,
    }));

    this.server.setRequestHandler(CallToolRequestSchema, async (request) => {
      const { name, arguments: args } = request.params;

      try {
        switch (name) {
          case 'login_with_credentials':
            return formatSuccessResponse(
              await this.authService.login(
                args?.username as string | undefined,
                args?.password as string | undefined
              )
            );

          case 'check_login_status':
            return formatSuccessResponse({
              success: true,
              isLoggedIn: await this.authService.checkLoginStatus(),
            });

          case 'logout':
            return formatSuccessResponse({
              success: await this.authService.logout(),
              message: '已登出',
            });

          case 'publish_article':
            if (!args) throw new Error('Missing arguments');
            return formatSuccessResponse(
              await this.articlePublisher.publish(args as any)
            );

          case 'publish_micro_post':
            if (!args) throw new Error('Missing arguments');
            return formatSuccessResponse(
              await this.microPublisher.publish(args as any)
            );

          case 'publish_xiaohongshu_data':
            if (!args) throw new Error('Missing arguments');
            return formatSuccessResponse(
              await this.multiPlatformService.publishBatch(
                args.records as any,
                (args.downloadFolder as string) || './downloads'
              )
            );

          default:
            throw new Error(`Unknown tool: ${name}`);
        }
      } catch (error) {
        logger.error(`Tool execution failed: ${name}`, error);
        return formatErrorResponse(error);
      }
    });
  }

  async start() {
    try {
      await browserPool.initialize();
      const transport = new StdioServerTransport();
      await this.server.connect(transport);
      logger.info('今日头条 MCP 服务器已启动');
    } catch (error) {
      logger.error('服务器启动失败', error);
      throw error;
    }
  }

  async stop() {
    try {
      await browserPool.cleanup();
      logger.info('今日头条 MCP 服务器已停止');
    } catch (error) {
      logger.error('服务器停止失败', error);
    }
  }
}
