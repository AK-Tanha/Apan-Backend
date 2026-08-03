import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum } from 'class-validator';

export enum UserRoleDto {
  USER = 'USER',
  ADMIN = 'ADMIN',
}

export class UpdateUserRoleDto {
  @ApiProperty({ enum: UserRoleDto, example: 'ADMIN' })
  @IsEnum(UserRoleDto)
  role: UserRoleDto;
}

export class ListUsersQueryDto {
  @ApiPropertyOptional({ example: 'USER' })
  role?: string;
}
