import { describe, it, expect } from 'vitest';
import { sanitizeText, truncateText } from '../../src/utils/text.sanitizer.js';

describe('Text Sanitizer', () => {
  describe('sanitizeText', () => {
    it('should remove problematic characters', () => {
      const text = 'Hello\uFE0FWorld\u200D';
      const result = sanitizeText(text);
      expect(result).toBe('HelloWorld');
    });

    it('should preserve normal text', () => {
      const text = 'Hello World 你好世界';
      const result = sanitizeText(text);
      expect(result).toBe('Hello World 你好世界');
    });

    it('should clean multiple spaces', () => {
      const text = 'Hello    World';
      const result = sanitizeText(text);
      expect(result).toBe('Hello World');
    });

    it('should clean multiple newlines', () => {
      const text = 'Hello\n\n\nWorld';
      const result = sanitizeText(text);
      expect(result).toBe('Hello\n\nWorld');
    });

    it('should trim whitespace', () => {
      const text = '  Hello World  ';
      const result = sanitizeText(text);
      expect(result).toBe('Hello World');
    });

    it('should handle empty string', () => {
      const result = sanitizeText('');
      expect(result).toBe('');
    });
  });

  describe('truncateText', () => {
    it('should truncate long text', () => {
      const text = 'This is a very long text that needs to be truncated';
      const result = truncateText(text, 20);
      expect(result).toBe('This is a very lo...');
      expect(result.length).toBe(20);
    });

    it('should not truncate short text', () => {
      const text = 'Short text';
      const result = truncateText(text, 20);
      expect(result).toBe('Short text');
    });

    it('should handle exact length', () => {
      const text = '12345';
      const result = truncateText(text, 5);
      expect(result).toBe('12345');
    });
  });
});
