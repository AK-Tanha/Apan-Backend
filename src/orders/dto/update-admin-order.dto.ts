import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  ArrayMinSize,
  IsArray,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  Min,
  ValidateNested,
} from 'class-validator';

export class AdminUpdateOrderItemDto {
  @ApiPropertyOptional({ example: 'variant-uuid' })
  @IsString()
  @IsNotEmpty()
  variantId: string;

  @ApiPropertyOptional({ example: 2, minimum: 1 })
  @IsInt()
  @Min(1)
  quantity: number;
}

export class AdminUpdateOrderDto {
  @ApiPropertyOptional({ example: 'Rahim Uddin' })
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  name?: string;

  @ApiPropertyOptional({ example: '01712345678' })
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  phone?: string;

  @ApiPropertyOptional({ example: 'House 12, Road 5, Dhanmondi, Dhaka' })
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  address?: string;

  @ApiPropertyOptional({ type: [AdminUpdateOrderItemDto] })
  @IsOptional()
  @IsArray()
  @ArrayMinSize(1)
  @ValidateNested({ each: true })
  @Type(() => AdminUpdateOrderItemDto)
  items?: AdminUpdateOrderItemDto[];
}
