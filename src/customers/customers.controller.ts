import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Param,
  Body,
  UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { CustomersService } from './customers.service';
import { CreateCustomerDto } from './dto/create-customer.dto';
import { UpdateCustomerDto } from './dto/update-customer.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';

@ApiTags('customers')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('ADMIN')
@Controller('customers')
export class CustomersController {
  constructor(private customersService: CustomersService) {}

  @Post()
  @ApiOperation({ summary: 'Create a customer (admin only)' })
  create(@Body() dto: CreateCustomerDto) {
    return this.customersService.create(dto);
  }

  @Get()
  @ApiOperation({ summary: 'List all customers (admin only)' })
  findAll() {
    return this.customersService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get one customer with order history (admin only)' })
  findOne(@Param('id') id: string) {
    return this.customersService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a customer (admin only)' })
  update(@Param('id') id: string, @Body() dto: UpdateCustomerDto) {
    return this.customersService.update(id, dto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a customer (admin only)' })
  remove(@Param('id') id: string) {
    return this.customersService.remove(id);
  }
}
