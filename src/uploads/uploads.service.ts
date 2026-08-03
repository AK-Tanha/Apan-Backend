import {
  Injectable,
  BadRequestException,
  PayloadTooLargeException,
} from '@nestjs/common';
import { put, type PutBlobResult } from '@vercel/blob';
import { UploadFileDto } from './dto/upload-file.dto';

const MAX_IMAGE_SIZE = 7.5 * 1024 * 1024; // ~7.5MB binary
const ALLOWED = new Set([
  'image/jpeg',
  'image/png',
  'image/webp',
  'image/gif',
  'image/avif',
]);

export interface UploadResult {
  url: string;
}

@Injectable()
export class UploadsService {
  /**
   * Uploads a base64 image to Vercel Blob and returns the public URL.
   * When no BLOB_READ_WRITE_TOKEN is set (local dev without storage), it
   * falls back to returning the raw data URL so the app still works.
   */
  async upload(dto: UploadFileDto): Promise<UploadResult> {
    const data = dto.base64.includes(',')
      ? dto.base64.split(',')[1]
      : dto.base64;

    if (!data) {
      throw new BadRequestException('Empty image payload');
    }

    const buffer = Buffer.from(data, 'base64');

    if (buffer.byteLength === 0) {
      throw new BadRequestException('Could not decode image');
    }
    if (buffer.byteLength > MAX_IMAGE_SIZE) {
      throw new PayloadTooLargeException('Image exceeds 7.5MB limit');
    }
    if (!ALLOWED.has(dto.contentType)) {
      throw new BadRequestException(
        `Unsupported image type "${dto.contentType}". Allowed: JPEG, PNG, WebP, GIF, AVIF.`,
      );
    }

    const token = process.env.BLOB_READ_WRITE_TOKEN;

    if (!token) {
      // Dev fallback: hand back the data URL so uploads work without storage.
      return { url: `data:${dto.contentType};base64,${data}` };
    }

    const safeName = this.sanitizeFilename(dto.fileName || 'image');
    const pathname = `uploads/${Date.now()}-${safeName}`;

    const blob: PutBlobResult = await put(pathname, buffer, {
      access: 'public',
      contentType: dto.contentType,
      token,
    });

    return { url: blob.url };
  }

  private sanitizeFilename(name: string): string {
    const cleaned = name
      .toLowerCase()
      .replace(/[^a-z0-9._-]/g, '-')
      .replace(/-+/g, '-')
      .slice(0, 60);
    return cleaned || 'image';
  }
}
