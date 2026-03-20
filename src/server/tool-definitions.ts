export const TOOL_DEFINITIONS = [
  {
    name: 'login_with_credentials',
    description: '使用用户名密码登录今日头条（手动完成验证码）',
    inputSchema: {
      type: 'object',
      properties: {
        username: { type: 'string', description: '用户名（可选）' },
        password: { type: 'string', description: '密码（可选）' },
      },
    },
  },
  {
    name: 'check_login_status',
    description: '检查当前登录状态',
    inputSchema: {
      type: 'object',
      properties: {},
    },
  },
  {
    name: 'logout',
    description: '登出当前账户',
    inputSchema: {
      type: 'object',
      properties: {},
    },
  },
  {
    name: 'publish_article',
    description: '发布图文文章到今日头条',
    inputSchema: {
      type: 'object',
      properties: {
        title: { 
          type: 'string', 
          description: '文章标题（2-30字）',
          minLength: 2,
          maxLength: 30,
        },
        content: { 
          type: 'string', 
          description: '文章内容' 
        },
        images: {
          type: 'array',
          items: { type: 'string' },
          description: '图片路径列表（本地路径或URL）',
          maxItems: 20,
        },
        tags: {
          type: 'array',
          items: { type: 'string' },
          description: '标签列表',
          maxItems: 5,
        },
        original: {
          type: 'boolean',
          description: '是否原创',
          default: true,
        },
      },
      required: ['title', 'content'],
    },
  },
  {
    name: 'publish_micro_post',
    description: '发布微头条',
    inputSchema: {
      type: 'object',
      properties: {
        content: { 
          type: 'string', 
          description: '微头条内容（建议2000字以内）',
          maxLength: 2000,
        },
        images: {
          type: 'array',
          items: { type: 'string' },
          description: '配图路径列表（最多9张）',
          maxItems: 9,
        },
        topic: {
          type: 'string',
          description: '话题标签',
        },
      },
      required: ['content'],
    },
  },
  {
    name: 'publish_xiaohongshu_data',
    description: '批量发布小红书格式数据到今日头条',
    inputSchema: {
      type: 'object',
      properties: {
        records: {
          type: 'array',
          description: '小红书格式的数据记录列表',
          items: {
            type: 'object',
            properties: {
              title: { type: 'string' },
              content: { type: 'string' },
              image_url: { type: 'string' },
              小红书标题: { type: 'string' },
              仿写小红书文案: { type: 'string' },
              配图: { type: 'string' },
            },
          },
        },
        downloadFolder: {
          type: 'string',
          description: '图片下载目录',
          default: './downloads',
        },
      },
      required: ['records'],
    },
  },
] as const;

export type ToolName = typeof TOOL_DEFINITIONS[number]['name'];
