import { Controller, Get, Post, Body, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { StockMovementsService } from './stock-movements.service';
import { CreateStockMovementDto } from './dto/create-stock-movement.dto';
import { QueryStockMovementDto } from './dto/query-stock-movement.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';

@ApiTags('stock-movements')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('ADMIN')
@Controller('stock-movements')
export class StockMovementsController {
  constructor(private service: StockMovementsService) {}

  @Get()
  @ApiOperation({
    summary: 'List stock movements (in/out with reasons), newest first',
  })
  findAll(@Query() query: QueryStockMovementDto) {
    return this.service.findAll(query);
  }

  @Post()
  @ApiOperation({
    summary:
      'Manually adjust stock. Positive quantity adds stock, negative removes it. A reason is recorded.',
  })
  adjust(@Body() dto: CreateStockMovementDto) {
    return this.service.adjust(dto);
  }
}
