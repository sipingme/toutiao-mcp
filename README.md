# 今日头条 MCP 服务器

> 基于 Node.js/TypeScript 的今日头条内容管理 MCP 服务器，支持自动登录、内容发布、多平台兼容。

## ✨ 特性

- 🔐 **用户认证** - 自动登录、Cookie 持久化
- 📝 **内容发布** - 图文文章、微头条发布
-  **多平台兼容** - 支持小红书数据格式
- 🖼️ **图片处理** - 自动上传、压缩优化
- ⚡ **高性能** - Playwright + Fastify

## 📦 快速开始

### 安装

```bash
# 克隆项目
git clone <repository-url>
cd toutiao-mcp

# 安装依赖
npm install

# 安装浏览器
npx playwright install chromium

# 配置环境变量
cp .env.example .env
```

### 运行

```bash
# 开发模式
npm run dev

# 构建
npm run build

# 生产模式
npm start
```

### 运行示例

```bash
# 基础使用示例
npm run example:basic

# 多平台发布示例
npm run example:multi

# 批量发布示例
npm run example:batch
```

## 🎯 MCP 工具

### 认证
- `login_with_credentials` - 登录今日头条
- `check_login_status` - 检查登录状态
- `logout` - 登出

### 发布
- `publish_article` - 发布图文文章
- `publish_micro_post` - 发布微头条
- `publish_xiaohongshu_data` - 批量发布小红书数据

## 💡 使用示例

### 1. 登录

```typescript
import { AuthService } from './src/auth/auth.service';

const authService = new AuthService();
await authService.login();
```

### 2. 发布文章

```typescript
import { ArticlePublisher } from './src/publisher/article.publisher';

const publisher = new ArticlePublisher();
await publisher.publish({
  title: '文章标题',
  content: '文章内容',
  images: ['path/to/image.jpg'],
  tags: ['科技', '工具']
});
```

### 3. 多平台发布

```typescript
import { MultiPlatformService } from './src/multi-platform/multi-platform.service';

const service = new MultiPlatformService();
await service.publishBatch([
  {
    '小红书标题': '标题',
    '仿写小红书文案': '内容',
    '配图': 'https://example.com/image.jpg'
  }
], './downloads');
```

## 🛠️ 技术栈

- **MCP SDK** - @modelcontextprotocol/sdk
- **浏览器自动化** - Playwright
- **Web 框架** - Fastify
- **图像处理** - Sharp
- **数据验证** - Zod
- **日志** - Pino
- **测试** - Vitest

## � 部署

### Docker

```bash
# 构建镜像
docker build -t toutiao-mcp .

# 运行容器
docker run -d \
  --name toutiao-mcp \
  -v $(pwd)/data:/app/data \
  toutiao-mcp
```

### PM2

```bash
# 安装 PM2
npm install -g pm2

# 启动服务
pm2 start dist/index.js --name toutiao-mcp

# 查看状态
pm2 status
```

## 📝 开发

```bash
# 运行测试
npm test

# 代码检查
npm run lint

# 代码格式化
npm run format

# 类型检查
npm run type-check
```

## � 项目结构

```
toutiao-mcp/
├── src/
│   ├── auth/              # 认证模块
│   ├── publisher/         # 发布模块
│   ├── multi-platform/    # 多平台兼容
│   ├── analytics/         # 数据分析
│   ├── utils/             # 工具函数
│   └── types/             # 类型定义
├── tests/                 # 测试文件
├── examples/              # 使用示例
└── dist/                  # 构建输出
```

## ⚙️ 配置

环境变量配置（`.env`）：

```env
# 服务器配置
NODE_ENV=development
PORT=8003
LOG_LEVEL=info

# Playwright 配置
PLAYWRIGHT_HEADLESS=false
PLAYWRIGHT_TIMEOUT=30000

# 存储配置
DATA_DIR=./data
COOKIES_FILE=./data/cookies.json
DOWNLOAD_DIR=./downloads
```

## ⚠️ 注意事项

1. **首次使用需要登录** - 运行后调用 `login_with_credentials` 工具
2. **图片格式** - 支持 JPG、PNG、GIF、WebP
3. **发布频率** - 建议控制发布频率，避免被平台限制
4. **内容限制** - 文章标题 2-30 字，微头条建议 2000 字以内

## 🐛 故障排查

### 登录失败
- 检查 Cookie 文件是否存在
- 尝试重新登录
- 检查网络连接

### 发布失败
- 确认已登录
- 检查内容格式
- 查看详细错误日志

### 依赖问题
```bash
# 清理并重新安装
rm -rf node_modules package-lock.json
npm install
```

## �📄 许可证

MIT

## 🤝 贡献

欢迎提交 Issue 和 Pull Request！

---

**版本**: 1.0.0  
**Node.js**: >= 18.0.0
