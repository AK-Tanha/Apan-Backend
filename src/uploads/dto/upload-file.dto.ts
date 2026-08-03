import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, MaxLength } from 'class-validator';

export class UploadFileDto {
  @ApiProperty({ example: 'classic-polo.jpg' })
  @IsString()
  @IsNotEmpty()
  fileName: string;

  @ApiProperty({ example: 'image/jpeg' })
  @IsString()
  @IsNotEmpty()
  contentType: string;

  @ApiProperty({
    example: 'data:image/jpeg;base64,/9j/...',
    description:
      'Base64 image (optionally with a data: URL prefix), max ~7.5MB binary.',
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(10_000_000, {
    message: 'Image is too large. Max ~7.5MB after decode.',
  })
  base64: string;
}
