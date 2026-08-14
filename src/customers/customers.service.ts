import {
  Injectable,
  NotFoundException,
  ConflictException,
  BadRequestException,
} from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { PrismaService } from '../prisma/prisma.service';
import { CreateCustomerDto } from './dto/create-customer.dto';
import { UpdateCustomerDto } from './dto/update-customer.dto';

@Injectable()
export class CustomersService {
  constructor(private prisma: PrismaService) {}

  findAll() {
    return this.prisma.user.findMany({
      where: { role: 'USER' },
      select: {
        id: true,
        name: true,
        phone: true,
        address: true,
        image: true,
        createdAt: true,
        _count: { select: { orders: true } },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(id: string) {
    const customer = await this.prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        name: true,
        phone: true,
        address: true,
        image: true,
        createdAt: true,
        orders: {
          include: { items: { include: { product: true, variant: true } } },
          orderBy: { createdAt: 'desc' },
        },
      },
    });
    if (!customer) throw new NotFoundException('Customer not found');
    return customer;
  }

  async create(dto: CreateCustomerDto) {
    const existing = await this.prisma.user.findUnique({
      where: { phone: dto.phone },
    });
    if (existing)
      throw new ConflictException('Phone number already registered');

    const hashedPassword = await bcrypt.hash(dto.password, 10);

    return this.prisma.user.create({
      data: {
        name: dto.name,
        phone: dto.phone,
        password: hashedPassword,
        role: 'USER',
        ...(dto.address && { address: dto.address }),
      },
      select: {
        id: true,
        name: true,
        phone: true,
        address: true,
        image: true,
        createdAt: true,
        _count: { select: { orders: true } },
      },
    });
  }

  async update(id: string, dto: UpdateCustomerDto) {
    await this.findOne(id);

    if (dto.phone) {
      const existing = await this.prisma.user.findFirst({
        where: { phone: dto.phone, id: { not: id } },
      });
      if (existing)
        throw new ConflictException('Phone number already registered');
    }

    return this.prisma.user.update({
      where: { id },
      data: {
        ...(dto.name !== undefined && { name: dto.name }),
        ...(dto.phone !== undefined && { phone: dto.phone }),
        ...(dto.address !== undefined && { address: dto.address }),
        ...(dto.password !== undefined && {
          password: await bcrypt.hash(dto.password, 10),
        }),
      },
      select: {
        id: true,
        name: true,
        phone: true,
        address: true,
        image: true,
        createdAt: true,
        _count: { select: { orders: true } },
      },
    });
  }

  async remove(id: string) {
    const customer = await this.prisma.user.findUnique({
      where: { id },
      include: { _count: { select: { orders: true } } },
    });
    if (!customer) throw new NotFoundException('Customer not found');

    if (customer._count.orders > 0) {
      throw new BadRequestException(
        'Cannot delete a customer with order history. Delete their orders first.',
      );
    }

    return this.prisma.$transaction(async (tx) => {
      await tx.cart.deleteMany({ where: { userId: id } });
      return tx.user.delete({ where: { id } });
    });
  }
}
