import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsOptional, IsBoolean } from 'class-validator';

export class CreateCollectionDto {
  @ApiProperty({ example: 'Summer Sale' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ example: 'summer-sale' })
  @IsString()
  @IsNotEmpty()
  slug: string;

  @ApiPropertyOptional({ example: 'Curated picks for the summer' })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional({
    example: 'https://picsum.photos/seed/collection/1200/600',
    description: 'Banner image shown for this collection on the storefront',
  })
  @IsOptional()
  @IsString()
  image?: string;

  @ApiPropertyOptional({
    example: 'https://picsum.photos/seed/collection/600/1200',
    description:
      'Portrait image for small screens (hero on mobile). Falls back to `image` when not set.',
  })
  @IsOptional()
  @IsString()
  mobileImage?: string;

  @ApiPropertyOptional({ example: true, default: true })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}
