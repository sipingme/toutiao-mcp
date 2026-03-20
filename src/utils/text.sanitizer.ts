export function sanitizeText(text: string): string {
  if (!text) {
    return text;
  }

  // 移除问题字符但保留常用 emoji
  const problematicChars = /[\uFE0F\u200D\u200C\u200B\uFEFF]+/g;
  let cleaned = text.replace(problematicChars, '');

  // 清理多余的空白字符，但保留换行
  cleaned = cleaned.replace(/[ \t]+/g, ' ');
  cleaned = cleaned.replace(/\n\s*\n/g, '\n\n');
  cleaned = cleaned.trim();

  return cleaned;
}

export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) {
    return text;
  }
  return text.substring(0, maxLength - 3) + '...';
}
