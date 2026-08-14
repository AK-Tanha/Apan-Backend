import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class UpdateSiteDto {
  @ApiPropertyOptional({ example: 'APAN Apparel' })
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  siteName?: string;

  @ApiPropertyOptional({ example: 'https://cdn.example.com/logo.png' })
  @IsOptional()
  @IsString()
  logoUrl?: string;

  @ApiPropertyOptional({
    example: 'Premium apparel for the modern Bangladeshi',
  })
  @IsOptional()
  @IsString()
  description?: string;
}
