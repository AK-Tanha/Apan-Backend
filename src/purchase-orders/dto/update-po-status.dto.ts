import { ApiProperty } from '@nestjs/swagger';
import { IsEnum } from 'class-validator';
import { PurchaseOrderStatus } from '@prisma/client';

export class UpdatePurchaseOrderStatusDto {
  @ApiProperty({ enum: PurchaseOrderStatus, example: 'RECEIVED' })
  @IsEnum(PurchaseOrderStatus)
  status: PurchaseOrderStatus;
}