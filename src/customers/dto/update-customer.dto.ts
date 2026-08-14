import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString, MinLength } from 'class-validator';

export class UpdateCustomerDto {
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
  address?: string;

  @ApiPropertyOptional({ example: 'newPassword123' })
  @IsOptional()
  @IsString()
  @MinLength(6)
  password?: string;
}
