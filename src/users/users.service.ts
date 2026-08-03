import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  findAll() {
    return this.prisma.user.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        _count: { select: { orders: true } },
        cart: { include: { _count: { select: { items: true } } } },
      },
      omit: { password: true },
    });
  }

  findAllByRole(role: string) {
    return this.prisma.user.findMany({
      where: { role: role === 'ADMIN' ? 'ADMIN' : 'USER' },
      orderBy: { createdAt: 'desc' },
      include: {
        _count: { select: { orders: true } },
        cart: { include: { _count: { select: { items: true } } } },
      },
      omit: { password: true },
    });
  }

  async findOne(id: string) {
    const user = await this.prisma.user.findUnique({
      where: { id },
      include: {
        _count: { select: { orders: true } },
        orders: {
          orderBy: { createdAt: 'desc' },
          take: 10,
          include: { _count: { select: { items: true } } },
        },
      },
      omit: { password: true },
    });
    if (!user) throw new NotFoundException(`User ${id} not found`);
    return user;
  }

  async updateRole(id: string, role: 'USER' | 'ADMIN') {
    await this.findOne(id);
    return this.prisma.user.update({
      where: { id },
      data: { role },
      omit: { password: true },
    });
  }
}
