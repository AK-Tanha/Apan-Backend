import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString, MinLength } from 'class-validator';

export class CreateCustomerDto {
  @ApiProperty({ example: 'Rahim Uddin' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ example: '01712345678' })
  @IsString()
  @IsNotEmpty()
  phone: string;

  @ApiProperty({ example: 'password123' })
  @IsString()
  @MinLength(6)
  password: string;

  @ApiPropertyOptional({ example: 'House 12, Road 5, Dhanmondi, Dhaka' })
  @IsOptional()
  @IsString()
  address?: string;
}
