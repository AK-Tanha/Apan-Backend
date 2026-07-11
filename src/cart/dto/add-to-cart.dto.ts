import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsInt, Min } from 'class-validator';

export class AddToCartDto {
  @ApiProperty({ example: 'product-uuid-here' })
  @IsString()
  @IsNotEmpty()
  productId: string;

  @ApiProperty({ example: 'variant-uuid-here' })
  @IsString()
  @IsNotEmpty()
  variantId: string;

  @ApiProperty({ example: 2 })
  @IsInt()
  @Min(1)
  quantity: number;
}