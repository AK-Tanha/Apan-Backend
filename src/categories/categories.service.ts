import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';

@Injectable()
export class CategoriesService {
  constructor(private prisma: PrismaService) {}

  async create(dto: CreateCategoryDto) {
    try {
      return await this.prisma.category.create({ data: dto });
    } catch (err) {
      this.handleConflict(err, dto.slug);
    }
  }

  findAll() {
    return this.prisma.category.findMany({
      include: { _count: { select: { products: true } } },
      orderBy: { name: 'asc' },
    });
  }

  async findOne(id: string) {
    const category = await this.prisma.category.findUnique({ where: { id } });
    if (!category) throw new NotFoundException(`Category ${id} not found`);
    return category;
  }

  async update(id: string, dto: UpdateCategoryDto) {
    await this.findOne(id); // throws if not found
    try {
      return await this.prisma.category.update({ where: { id }, data: dto });
    } catch (err) {
      this.handleConflict(err, dto.slug);
    }
  }

  async remove(id: string) {
    const category = await this.prisma.category.findUnique({
      where: { id },
      include: { _count: { select: { products: true } } },
    });
    if (!category) throw new NotFoundException(`Category ${id} not found`);

    if (category._count.products > 0) {
      throw new BadRequestException(
        `Cannot delete "${category.name}" — ${category._count.products} product(s) still use this category. Reassign them first.`,
      );
    }

    return this.prisma.category.delete({ where: { id } });
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
        `A category with this ${
          slug ? `slug ("${slug}")` : 'name'
        } already exists.`,
      );
    }
    throw err;
  }
}
