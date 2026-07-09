import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsInt, Min, IsOptional, IsNumber } from 'class-validator';

export class CreateVariantDto {
  @ApiProperty({ example: 'M' })
  @IsString()
  size: string;

  @ApiProperty({ example: 'Black' })
  @IsString()
  color: string;

  @ApiProperty({ example: 20 })
  @IsInt()
  @Min(0)
  stock: number;

  @ApiProperty({ example: 990, required: false })
  @IsOptional()
  @IsNumber()
  price?: number;
}