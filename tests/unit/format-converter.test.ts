import { describe, it, expect } from 'vitest';
import { FormatConverter } from '../../src/multi-platform/format.converter.js';

describe('FormatConverter', () => {
  const converter = new FormatConverter();

  describe('convertFromXiaohongshu', () => {
    it('should convert xiaohongshu format with standard fields', () => {
      const record = {
        title: '测试标题',
        content: '测试内容',
        image_url: 'https://example.com/image.jpg',
      };

      const result = converter.convertFromXiaohongshu(record);

      expect(result.title).toBe('测试标题');
      expect(result.content).toBe('测试内容');
      expect(result.imageUrl).toBe('https://example.com/image.jpg');
      expect(result.originalTitle).toBe('测试标题');
      expect(result.originalContent).toBe('测试内容');
    });

    it('should convert xiaohongshu format with Chinese field names', () => {
      const record = {
        小红书标题: '中文标题',
        仿写小红书文案: '中文内容',
        配图: 'https://example.com/image.jpg',
      };

      const result = converter.convertFromXiaohongshu(record);

      expect(result.title).toBe('中文标题');
      expect(result.content).toBe('中文内容');
      expect(result.imageUrl).toBe('https://example.com/image.jpg');
    });

    it('should handle missing fields with defaults', () => {
      const record = {};

      const result = converter.convertFromXiaohongshu(record);

      expect(result.title).toBe('无标题');
      expect(result.content).toBe('');
      expect(result.imageUrl).toBeNull();
    });

    it('should sanitize text content', () => {
      const record = {
        title: '标题\u200B\uFE0F',
        content: '内容\u200D测试',
      };

      const result = converter.convertFromXiaohongshu(record);

      expect(result.title).toBe('标题');
      expect(result.content).toBe('内容测试');
    });
  });

  describe('convertBatch', () => {
    it('should convert multiple records', () => {
      const records = [
        { title: '标题1', content: '内容1' },
        { title: '标题2', content: '内容2' },
        { title: '标题3', content: '内容3' },
      ];

      const results = converter.convertBatch(records);

      expect(results).toHaveLength(3);
      expect(results[0].title).toBe('标题1');
      expect(results[1].title).toBe('标题2');
      expect(results[2].title).toBe('标题3');
    });

    it('should handle empty array', () => {
      const results = converter.convertBatch([]);
      expect(results).toHaveLength(0);
    });
  });
});
