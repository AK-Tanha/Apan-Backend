import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsNotEmpty, IsString, Max, Min } from 'class-validator';

export class CreateStockMovementDto {
  @ApiProperty({ description: 'Variant id to adjust' })
  @IsString()
  @IsNotEmpty()
  variantId: string;

  @ApiProperty({
    description:
      'Signed change. Positive = add stock, negative = remove stock. Must be non-zero.',
    example: -5,
  })
  @IsInt()
  @Min(-100000)
  @Max(100000)
  quantity: number;

  @ApiProperty({
    description: 'Human-readable reason for the stock change.',
    example: 'Damaged during photoshoot — returned to supplier',
  })
  @IsString()
  @IsNotEmpty()
  reason: string;
}
