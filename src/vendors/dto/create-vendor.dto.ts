import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsOptional, IsEmail } from 'class-validator';

export class CreateVendorDto {
  @ApiProperty({ example: 'Dhaka Textile Suppliers' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ example: '01812345678' })
  @IsString()
  @IsNotEmpty()
  phone: string;

  @ApiProperty({ example: 'contact@vendor.com', required: false })
  @IsOptional()
  @IsEmail()
  email?: string;

  @ApiProperty({ example: 'Old Dhaka, Wholesale Market', required: false })
  @IsOptional()
  @IsString()
  address?: string;
}