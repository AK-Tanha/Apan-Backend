import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsNotEmpty,
  IsArray,
  ValidateNested,
  ArrayMinSize,
  IsInt,
  Min,
  IsNumber,
  IsOptional,
} from 'class-validator';
import { Type } from 'class-transformer';

class PurchaseOrderItemDto {
  @ApiProperty({ example: 'variant-uuid-here' })
  @IsString()
  @IsNotEmpty()
  variantId: string;

  @ApiProperty({ example: 50 })
  @IsInt()
  @Min(1)
  quantity: number;

  @ApiProperty({ example: 350 })
  @IsNumber()
  @Min(0)
  unitCost: number;
}

export class CreatePurchaseOrderDto {
  @ApiProperty({ example: 'vendor-uuid-here' })
  @IsString()
  @IsNotEmpty()
  vendorId: string;

  @ApiProperty({ example: 'Restock for July collection', required: false })
  @IsOptional()
  @IsString()
  notes?: string;

  @ApiProperty({ type: [PurchaseOrderItemDto] })
  @IsArray()
  @ArrayMinSize(1)
  @ValidateNested({ each: true })
  @Type(() => PurchaseOrderItemDto)
  items: PurchaseOrderItemDto[];
}