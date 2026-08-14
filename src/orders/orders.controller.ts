import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  UseGuards,
  Patch,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { OrdersService } from './orders.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { CreateGuestOrderDto } from './dto/create-guest-order.dto';
import { CreateAdminOrderDto } from './dto/create-admin-order.dto';
import { LookupOrderDto } from './dto/lookup-order.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { OptionalJwtAuthGuard } from '../auth/guards/optional-jwt-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { UpdateOrderStatusDto } from './dto/update-order-status.dto';

@ApiTags('orders')
@ApiBearerAuth()
@Controller('orders')
export class OrdersController {
  constructor(private ordersService: OrdersService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Checkout: create an order from the current cart' })
  create(@CurrentUser() user: any, @Body() dto: CreateOrderDto) {
    return this.ordersService.createFromCart(user.userId, dto);
  }

  @Post('guest')
  @UseGuards(OptionalJwtAuthGuard)
  @ApiOperation({
    summary:
      'Checkout without an account. Attaches the user when a valid token is present.',
  })
  createGuest(
    @CurrentUser() user: any,
    @Body() dto: CreateGuestOrderDto,
  ) {
    return this.ordersService.createGuestOrder(dto, user?.userId);
  }

  @Post('lookup')
  @ApiOperation({ summary: 'Look up a guest order by id + phone' })
  lookup(@Body() dto: LookupOrderDto) {
    return this.ordersService.findByIdAndPhone(dto.id, dto.phone);
  }

  @Get('admin/all')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  @ApiOperation({ summary: 'List all orders (admin only)' })
  findAllAdmin() {
    return this.ordersService.findAllAdmin();
  }

  @Get('admin/:id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  @ApiOperation({ summary: 'Get any order by id (admin only)' })
  findOneAdmin(@Param('id') id: string) {
    return this.ordersService.findOneAdmin(id);
  }

  @Post('admin/create')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  @ApiOperation({
    summary:
      'Place an order on behalf of a customer (admin only). Attaches an existing customer by id, otherwise reuses/creates a user by phone.',
  })
  createAdmin(@Body() dto: CreateAdminOrderDto) {
    return this.ordersService.createAdminOrder(dto);
  }

  @Patch(':id/status')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  @ApiOperation({ summary: 'Update order status (admin only)' })
  updateStatus(@Param('id') id: string, @Body() dto: UpdateOrderStatusDto) {
    return this.ordersService.updateStatus(id, dto);
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: "List current user's orders" })
  findAll(@CurrentUser() user: any) {
    return this.ordersService.findAllForUser(user.userId);
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Get one order' })
  findOne(@CurrentUser() user: any, @Param('id') id: string) {
    return this.ordersService.findOne(user.userId, id);
  }
}
