import { Controller, Get, Post, Patch, Body, Param, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { PurchaseOrdersService } from './purchase-orders.service';
import { CreatePurchaseOrderDto } from './dto/create-purchase-order.dto';
import { UpdatePurchaseOrderStatusDto } from './dto/update-po-status.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';

@ApiTags('purchase-orders')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('ADMIN')
@Controller('purchase-orders')
export class PurchaseOrdersController {
  constructor(private poService: PurchaseOrdersService) {}

  @Post()
  @ApiOperation({ summary: 'Create a purchase order' })
  create(@Body() dto: CreatePurchaseOrderDto) {
    return this.poService.create(dto);
  }

  @Get()
  @ApiOperation({ summary: 'List all purchase orders' })
  findAll() {
    return this.poService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get one purchase order' })
  findOne(@Param('id') id: string) {
    return this.poService.findOne(id);
  }

  @Patch(':id/status')
  @ApiOperation({ summary: 'Update purchase order status (RECEIVED triggers stock increment)' })
  updateStatus(@Param('id') id: string, @Body() dto: UpdatePurchaseOrderStatusDto) {
    return this.poService.updateStatus(id, dto);
  }
}