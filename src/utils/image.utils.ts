import sharp from 'sharp';
import fs from 'fs-extra';
import path from 'path';
import { logger } from './logger.js';
import { IMAGE_CONFIG } from './constants.js';

export async function compressImage(
  inputPath: string,
  outputPath?: string
): Promise<string> {
  try {
    const stats = await fs.stat(inputPath);
    
    if (stats.size <= IMAGE_CONFIG.maxSize) {
      logger.info(`图片无需压缩: ${inputPath}`);
      return inputPath;
    }

    const output = outputPath || inputPath.replace(/\.(jpg|jpeg|png)$/i, '.compressed.jpg');

    await sharp(inputPath)
      .jpeg({ quality: IMAGE_CONFIG.quality, mozjpeg: true })
      .toFile(output);

    const compressedStats = await fs.stat(output);
    logger.info(
      `图片已压缩: ${stats.size} -> ${compressedStats.size} (${Math.round((compressedStats.size / stats.size) * 100)}%)`
    );

    return output;
  } catch (error) {
    logger.error('图片压缩失败', error);
    return inputPath;
  }
}

export function getImageExtension(filename: string): string {
  const ext = path.extname(filename).toLowerCase().replace('.', '');
  return IMAGE_CONFIG.supportedFormats.includes(ext) ? ext : 'jpg';
}

export function isImageFile(filename: string): boolean {
  const ext = getImageExtension(filename);
  return IMAGE_CONFIG.supportedFormats.includes(ext);
}
