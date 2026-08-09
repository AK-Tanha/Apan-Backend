import { ApiPropertyOptional } from '@nestjs/swagger';
import { PartialType } from '@nestjs/swagger';
import { IsOptional, IsArray, IsString } from 'class-validator';
import { CreateCollectionDto } from './create-collection.dto';

export class UpdateCollectionDto extends PartialType(CreateCollectionDto) {
  @ApiPropertyOptional({
    example: ['product-uuid-1', 'product-uuid-2'],
    description:
      'Full set of product ids that should belong to this collection. Omit to leave unchanged.',
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  productIds?: string[];
}
