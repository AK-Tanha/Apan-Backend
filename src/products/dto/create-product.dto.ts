import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsArray,
  ValidateNested,
  ArrayMinSize,
} from 'class-validator';
import { Type } from 'class-transformer';
import { CreateVariantDto } from './create-variant.dto';

export class CreateProductDto {
  @ApiProperty({ example: 'Classic Court Polo' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ example: 'Premium cotton polo shirt', required: false })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({ example: 990 })
  @IsNumber()
  basePrice: number;

  @ApiProperty({ example: 'LOT-2026-07', required: false })
  @IsOptional()
  @IsString()
  lotNumber?: string;

  @ApiProperty({ example: 'category-uuid-here' })
  @IsString()
  @IsNotEmpty()
  categoryId: string;

  @ApiProperty({ example: 'suplier-uuid-here', required: false })
  @IsString()
  @IsOptional()
  vendorId?: string;

  @ApiProperty({ example: ['https://example.com/img1.jpg'], required: false })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  imageUrls?: string[];

  @ApiProperty({ type: [CreateVariantDto] })
  @IsArray()
  @ArrayMinSize(1)
  @ValidateNested({ each: true })
  @Type(() => CreateVariantDto)
  variants: CreateVariantDto[];
}