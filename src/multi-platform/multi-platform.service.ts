import axios from 'axios';
import fs from 'fs-extra';
import path from 'path';
import { FormatConverter } from './format.converter.js';
import { ArticlePublisher } from '../publisher/article.publisher.js';
import { MicroPublisher } from '../publisher/micro.publisher.js';
import { logger } from '../utils/logger.js';
import type {
  XiaohongshuRecord,
  BatchPublishResult,
  PublishResultDetail,
} from '../types/index.js';

export class MultiPlatformService {
  private converter: FormatConverter;
  private articlePublisher: ArticlePublisher;
  private microPublisher: MicroPublisher;

  constructor() {
    this.converter = new FormatConverter();
    this.articlePublisher = new ArticlePublisher();
    this.microPublisher = new MicroPublisher();
  }

  async publishBatch(
    records: XiaohongshuRecord[],
    downloadFolder: string = './downloads'
  ): Promise<BatchPublishResult> {
    await fs.ensureDir(downloadFolder);
    logger.info(`开始批量发布 ${records.length} 条记录`);

    const results: PublishResultDetail[] = [];

    for (let i = 0; i < records.length; i++) {
      const record = records[i];
      logger.info(`\n--- 正在处理记录 ${i + 1}/${records.length} ---`);

      try {
        const toutiaoData = this.converter.convertFromXiaohongshu(record);
        logger.info(`标题: ${toutiaoData.title}`);

        // 下载图片
        const localImages: string[] = [];
        if (toutiaoData.imageUrl) {
          const imagePath = await this.downloadImage(
            toutiaoData.imageUrl,
            downloadFolder,
            i
          );
          if (imagePath) {
            localImages.push(imagePath);
          }
        }

        // 判断发布类型
        const isMicroPost = toutiaoData.content.length <= 2000 && localImages.length <= 9;

        let publishResult;
        if (isMicroPost) {
          publishResult = await this.microPublisher.publish({
            content: `${toutiaoData.title}\n\n${toutiaoData.content}`,
            images: localImages,
          });
        } else {
          publishResult = await this.articlePublisher.publish({
            title: toutiaoData.title,
            content: toutiaoData.content,
            images: localImages,
          });
        }

        results.push({
          index: i + 1,
          title: toutiaoData.title,
          publishResult,
          imageCount: localImages.length,
        });

        if (publishResult.success) {
          logger.info(`✓ 记录 ${i + 1} 发布成功`);
        } else {
          logger.error(`✗ 记录 ${i + 1} 发布失败: ${publishResult.message}`);
        }

        // 避免请求过于频繁
        await new Promise((resolve) => setTimeout(resolve, 2000));
      } catch (error) {
        logger.error(`处理记录 ${i + 1} 时发生异常`, error);
        results.push({
          index: i + 1,
          title: record.title || '未知',
          publishResult: {
            success: false,
            message: `处理异常: ${error}`,
          },
          imageCount: 0,
        });
      }
    }

    const successCount = results.filter((r) => r.publishResult.success).length;
    const failedCount = results.length - successCount;

    return {
      success: true,
      message: `批量发布完成，成功 ${successCount}/${results.length} 条`,
      summary: {
        totalRecords: results.length,
        successCount,
        failedCount,
        successRate: Math.round((successCount / results.length) * 100 * 100) / 100,
      },
      details: results,
    };
  }

  private async downloadImage(
    imageUrl: string,
    downloadFolder: string,
    index: number
  ): Promise<string | null> {
    try {
      const response = await axios.get(imageUrl, {
        responseType: 'arraybuffer',
        timeout: 30000,
      });

      const urlPath = new URL(imageUrl).pathname;
      const ext = path.extname(urlPath) || '.jpg';
      const filename = `image_${index}_${Date.now()}${ext}`;
      const filepath = path.join(downloadFolder, filename);

      await fs.writeFile(filepath, response.data);
      logger.info(`图片已下载: ${filepath}`);

      return filepath;
    } catch (error) {
      logger.error(`下载图片失败 ${imageUrl}`, error);
      return null;
    }
  }
}
