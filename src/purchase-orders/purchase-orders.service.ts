import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreatePurchaseOrderDto } from './dto/create-purchase-order.dto';
import { UpdatePurchaseOrderStatusDto } from './dto/update-po-status.dto';
import { PurchaseOrderStatus } from '@prisma/client';

@Injectable()
export class PurchaseOrdersService {
  constructor(private prisma: PrismaService) {}

  async create(dto: CreatePurchaseOrderDto) {
    const totalCost = dto.items.reduce(
      (sum, item) => sum + item.unitCost * item.quantity,
      0,
    );

    return this.prisma.purchaseOrder.create({
      data: {
        vendorId: dto.vendorId,
        notes: dto.notes,
        totalCost,
        items: {
          create: dto.items.map((item) => ({
            variantId: item.variantId,
            quantity: item.quantity,
            unitCost: item.unitCost,
          })),
        },
      },
      include: { items: { include: { variant: true } }, vendor: true },
    });
  }

  findAll() {
    return this.prisma.purchaseOrder.findMany({
      include: { vendor: true, items: { include: { variant: true } } },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(id: string) {
    const po = await this.prisma.purchaseOrder.findUnique({
      where: { id },
      include: { vendor: true, items: { include: { variant: { include: { product: true } } } } },
    });
    if (!po) throw new NotFoundException('Purchase order not found');
    return po;
  }

  async updateStatus(id: string, dto: UpdatePurchaseOrderStatusDto) {
    const po = await this.findOne(id);

    if (po.status === 'RECEIVED') {
      throw new BadRequestException('This purchase order was already received');
    }
    if (po.status === 'CANCELLED') {
      throw new BadRequestException('Cannot update a cancelled purchase order');
    }

    // the transactional moment — stock only moves when status becomes RECEIVED
    if (dto.status === PurchaseOrderStatus.RECEIVED) {
      return this.prisma.$transaction(async (tx) => {
        for (const item of po.items) {
          await tx.productVariant.update({
            where: { id: item.variantId },
            data: { stock: { increment: item.quantity } },
          });

          await tx.stockMovement.create({
            data: {
              variantId: item.variantId,
              type: 'PURCHASE_IN',
              quantity: item.quantity,
              reason: `Received from PO ${po.id}`,
              purchaseOrderId: po.id,
            },
          });
        }

        return tx.purchaseOrder.update({
          where: { id },
          data: { status: 'RECEIVED', receivedAt: new Date() },
          include: { items: { include: { variant: true } }, vendor: true },
        });
      });
    }

    // any other status transition (PENDING -> ORDERED, or -> CANCELLED) is just a flag update
    return this.prisma.purchaseOrder.update({
      where: { id },
      data: { status: dto.status },
    });
  }
}