import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { CreateGuestOrderDto } from './dto/create-guest-order.dto';
import { UpdateOrderStatusDto } from './dto/update-order-status.dto';

@Injectable()
export class OrdersService {
  constructor(private prisma: PrismaService) {}

  private orderItems = {
    include: {
      product: { include: { images: true } },
      variant: true,
    },
  };

  private user = { omit: { password: true } };

  async createFromCart(userId: string, dto: CreateOrderDto) {
    const cart = await this.prisma.cart.findUnique({
      where: { userId },
      include: { items: { include: { variant: true, product: true } } },
    });

    if (!cart || cart.items.length === 0) {
      throw new BadRequestException('Cart is empty');
    }

    // check stock BEFORE the transaction so we can fail fast with a clear message
    for (const item of cart.items) {
      if (item.variant.stock < item.quantity) {
        throw new BadRequestException(
          `Not enough stock for ${item.product.name} (${item.variant.size}/${item.variant.color})`,
        );
      }
    }

    const totalAmount = cart.items.reduce((sum, item) => {
      const price = item.variant.price ?? item.product.basePrice;
      return sum + Number(price) * item.quantity;
    }, 0);

    // everything below either all succeeds or all rolls back
    return this.prisma.$transaction(async (tx) => {
      const order = await tx.order.create({
        data: {
          userId,
          address: dto.address,
          phone: dto.phone,
          totalAmount,
          items: {
            create: cart.items.map((item) => ({
              productId: item.productId,
              variantId: item.variantId,
              quantity: item.quantity,
              price: item.variant.price ?? item.product.basePrice,
            })),
          },
        },
        include: { items: this.orderItems, user: this.user },
      });

      for (const item of cart.items) {
        await tx.productVariant.update({
          where: { id: item.variantId },
          data: { stock: { decrement: item.quantity } },
        });
      }

      await tx.cartItem.deleteMany({ where: { cartId: cart.id } });

      return order;
    });
  }

  findAllForUser(userId: string) {
    return this.prisma.order.findMany({
      where: { userId },
      include: { items: this.orderItems, user: this.user },
      orderBy: { createdAt: 'desc' },
    });
  }

  async createGuestOrder(dto: CreateGuestOrderDto, userId?: string) {
    const variants = await this.prisma.productVariant.findMany({
      where: { id: { in: dto.items.map((i) => i.variantId) } },
      include: { product: true },
    });

    for (const item of dto.items) {
      const variant = variants.find((v) => v.id === item.variantId);
      if (!variant) {
        throw new BadRequestException('A product in your bag is no longer available');
      }
      if (variant.stock < item.quantity) {
        throw new BadRequestException(
          `Not enough stock for ${variant.product.name} (${variant.size}/${variant.color})`,
        );
      }
    }

    const totalAmount = dto.items.reduce((sum, item) => {
      const variant = variants.find((v) => v.id === item.variantId)!;
      const price = variant.price ?? variant.product.basePrice;
      return sum + Number(price) * item.quantity;
    }, 0);

    return this.prisma.$transaction(async (tx) => {
      const order = await tx.order.create({
        data: {
          userId: userId ?? null,
          name: dto.name,
          phone: dto.phone,
          address: dto.address,
          totalAmount,
          items: {
            create: dto.items.map((item) => {
              const variant = variants.find((v) => v.id === item.variantId)!;
              return {
                productId: variant.productId,
                variantId: item.variantId,
                quantity: item.quantity,
                price: variant.price ?? variant.product.basePrice,
              };
            }),
          },
        },
        include: { items: this.orderItems, user: this.user },
      });

      for (const item of dto.items) {
        await tx.productVariant.update({
          where: { id: item.variantId },
          data: { stock: { decrement: item.quantity } },
        });
      }

      return order;
    });
  }

  async findByIdAndPhone(id: string, phone: string) {
    const order = await this.prisma.order.findUnique({
      where: { id },
      include: { items: this.orderItems, user: this.user },
    });
    if (!order || order.phone !== phone) {
      throw new NotFoundException('Order not found');
    }
    return order;
  }

  async findOne(userId: string, id: string) {
    const order = await this.prisma.order.findUnique({
      where: { id },
      include: { items: this.orderItems, user: this.user },
    });
    if (!order || order.userId !== userId) {
      throw new NotFoundException('Order not found');
    }
    return order;
  }

  async updateStatus(id: string, dto: UpdateOrderStatusDto) {
    const order = await this.prisma.order.findUnique({ where: { id } });
    if (!order) throw new NotFoundException('Order not found');

    return this.prisma.order.update({
      where: { id },
      data: { status: dto.status },
    });
  }

  // admin view — all orders, not scoped to one user
  findAllAdmin() {
    return this.prisma.order.findMany({
      include: {
        items: this.orderItems,
        user: this.user,
      },
      orderBy: { createdAt: 'desc' },
    });
  }
}
