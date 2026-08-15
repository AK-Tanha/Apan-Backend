import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { CreateStockMovementDto } from './dto/create-stock-movement.dto';
import { QueryStockMovementDto } from './dto/query-stock-movement.dto';

@Injectable()
export class StockMovementsService {
  constructor(private prisma: PrismaService) {}

  async findAll(query: QueryStockMovementDto) {
    const { variantId, type, page = 1, limit = 50 } = query;

    const where: Prisma.StockMovementWhereInput = {
      ...(variantId && { variantId }),
      ...(type && { type }),
    };

    const [data, total] = await this.prisma.$transaction([
      this.prisma.stockMovement.findMany({
        where,
        include: { variant: { include: { product: true } } },
        orderBy: { createdAt: 'desc' },
        skip: (page - 1) * limit,
        take: limit,
      }),
      this.prisma.stockMovement.count({ where }),
    ]);

    return {
      data,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  // Manual adjustment — records an ADJUSTMENT movement with a reason and moves
  // the variant's stock in the same transaction so they can never drift apart.
  async adjust(dto: CreateStockMovementDto) {
    if (dto.quantity === 0) {
      throw new BadRequestException('Quantity must be a non-zero value');
    }

    const variant = await this.prisma.productVariant.findUnique({
      where: { id: dto.variantId },
    });
    if (!variant) {
      throw new NotFoundException('Variant not found');
    }

    return this.prisma.$transaction(async (tx) => {
      await tx.productVariant.update({
        where: { id: dto.variantId },
        data: { stock: { increment: dto.quantity } },
      });

      return tx.stockMovement.create({
        data: {
          variantId: dto.variantId,
          type: 'ADJUSTMENT',
          quantity: dto.quantity,
          reason: dto.reason,
        },
        include: { variant: { include: { product: true } } },
      });
    });
  }
}
