import { sanitizeText } from '../utils/text.sanitizer.js';
import type { XiaohongshuRecord, ToutiaoData } from '../types/index.js';

export class FormatConverter {
  convertFromXiaohongshu(record: XiaohongshuRecord): ToutiaoData {
    const title = record.title || record['小红书标题'] || '无标题';
    const content = record.content || record['仿写小红书文案'] || '';
    const imageUrl = record.image_url || record['配图'] || null;

    return {
      title: sanitizeText(title),
      content: sanitizeText(content),
      imageUrl,
      originalTitle: title,
      originalContent: content,
    };
  }

  convertBatch(records: XiaohongshuRecord[]): ToutiaoData[] {
    return records.map((record) => this.convertFromXiaohongshu(record));
  }
}
