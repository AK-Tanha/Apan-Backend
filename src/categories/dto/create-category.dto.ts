import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty } from 'class-validator';

export class CreateCategoryDto {
  @ApiProperty({ example: 'Polo' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ example: 'polo' })
  @IsString()
  @IsNotEmpty()
  slug: string;
}