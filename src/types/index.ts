export interface LoginResult {
  success: boolean;
  message: string;
}

export interface UserInfo {
  userId?: string;
  username?: string;
  nickname?: string;
  avatar?: string;
  followersCount?: number;
}

export interface ArticleData {
  title: string;
  content: string;
  images?: string[];
  tags?: string[];
  category?: string;
  coverImage?: string;
  publishTime?: string;
  original?: boolean;
}

export interface MicroPostData {
  content: string;
  images?: string[];
  topic?: string;
  location?: string;
  publishTime?: string;
}

export interface PublishResult {
  success: boolean;
  message: string;
  articleId?: string;
  url?: string;
}

export interface XiaohongshuRecord {
  title?: string;
  content?: string;
  image_url?: string;
  '小红书标题'?: string;
  '仿写小红书文案'?: string;
  '配图'?: string;
}

export interface ToutiaoData {
  title: string;
  content: string;
  imageUrl: string | null;
  originalTitle: string;
  originalContent: string;
}

export interface BatchPublishResult {
  success: boolean;
  message: string;
  summary: {
    totalRecords: number;
    successCount: number;
    failedCount: number;
    successRate: number;
  };
  details: PublishResultDetail[];
}

export interface PublishResultDetail {
  index: number;
  title: string;
  publishResult: PublishResult;
  imageCount: number;
}

export interface AnalyticsOverview {
  followersCount: number;
  totalArticles: number;
  totalReadCount: number;
  totalCommentCount: number;
  totalShareCount: number;
  totalLikeCount: number;
}

export interface ArticleStats {
  articleId: string;
  readCount: number;
  commentCount: number;
  shareCount: number;
  likeCount: number;
  collectCount: number;
  publishTime?: string;
}
