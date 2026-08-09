import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateCollectionDto } from './dto/create-collection.dto';
import { UpdateCollectionDto } from './dto/update-collection.dto';

@Injectable()
export class CollectionsService {
  constructor(private prisma: PrismaService) {}

  async create(dto: CreateCollectionDto) {
    try {
      return await this.prisma.collection.create({ data: dto });
    } catch (err) {
      this.handleConflict(err, dto.slug);
    }
  }

  findAll() {
    return this.prisma.collection.findMany({
      include: {
        _count: { select: { products: true } },
        products: {
          select: {
            id: true,
            name: true,
            isActive: true,
            basePrice: true,
            category: { select: { name: true } },
            images: { select: { url: true, isHero: true } },
          },
          orderBy: { createdAt: 'desc' },
        },
      },
      orderBy: { name: 'asc' },
    });
  }

  async findOne(id: string) {
    const collection = await this.prisma.collection.findUnique({
      where: { id },
      include: {
        _count: { select: { products: true } },
        products: {
          select: {
            id: true,
            name: true,
            isActive: true,
            images: { select: { url: true } },
          },
          orderBy: { name: 'asc' },
        },
      },
    });
    if (!collection) throw new NotFoundException(`Collection ${id} not found`);
    return collection;
  }

  async update(id: string, dto: UpdateCollectionDto) {
    await this.findOne(id); // throws if not found
    const { productIds, ...rest } = dto;
    try {
      return await this.prisma.collection.update({
        where: { id },
        data: {
          ...rest,
          ...(productIds && {
            products: {
              set: productIds.map((productId) => ({ id: productId })),
            },
          }),
        },
      });
    } catch (err) {
      this.handleConflict(err, dto.slug);
    }
  }

  async remove(id: string) {
    const collection = await this.prisma.collection.findUnique({
      where: { id },
      include: { _count: { select: { products: true } } },
    });
    if (!collection) throw new NotFoundException(`Collection ${id} not found`);

    if (collection._count.products > 0) {
      throw new BadRequestException(
        `Cannot delete "${collection.name}" — ${collection._count.products} product(s) are still in this collection. Remove them first.`,
      );
    }

    return this.prisma.collection.delete({ where: { id } });
  }

  /**
   * Maps Prisma constraint violations (duplicate name/slug) to a readable
   * 400 response instead of leaking a raw 500.
   */
  private handleConflict(err: unknown, slug?: string): never {
    if (
      typeof err === 'object' &&
      err !== null &&
      (err as { code?: string }).code === 'P2002'
    ) {
      throw new BadRequestException(
        `A collection with this ${
          slug ? `slug ("${slug}")` : 'name'
        } already exists.`,
      );
    }
    throw err;
  }
}
