import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty } from 'class-validator';

export class CreateOrderDto {
  @ApiProperty({ example: 'House 12, Road 5, Dhanmondi, Dhaka' })
  @IsString()
  @IsNotEmpty()
  address: string;

  @ApiProperty({ example: '01712345678' })
  @IsString()
  @IsNotEmpty()
  phone: string;
}