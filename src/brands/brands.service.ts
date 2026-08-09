import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateBrandDto } from './dto/create-brand.dto';
import { UpdateBrandDto } from './dto/update-brand.dto';

@Injectable()
export class BrandsService {
  constructor(private prisma: PrismaService) {}

  async create(dto: CreateBrandDto) {
    try {
      return await this.prisma.brand.create({ data: dto });
    } catch (err) {
      this.handleConflict(err, dto.slug);
    }
  }

  findAll() {
    return this.prisma.brand.findMany({
      include: { _count: { select: { products: true } } },
      orderBy: { name: 'asc' },
    });
  }

  async findOne(id: string) {
    const brand = await this.prisma.brand.findUnique({ where: { id } });
    if (!brand) throw new NotFoundException(`Brand ${id} not found`);
    return brand;
  }

  async update(id: string, dto: UpdateBrandDto) {
    await this.findOne(id); // throws if not found
    try {
      return await this.prisma.brand.update({ where: { id }, data: dto });
    } catch (err) {
      this.handleConflict(err, dto.slug);
    }
  }

  async remove(id: string) {
    const brand = await this.prisma.brand.findUnique({
      where: { id },
      include: { _count: { select: { products: true } } },
    });
    if (!brand) throw new NotFoundException(`Brand ${id} not found`);

    if (brand._count.products > 0) {
      throw new BadRequestException(
        `Cannot delete "${brand.name}" — ${brand._count.products} product(s) still use this brand. Reassign them first.`,
      );
    }

    return this.prisma.brand.delete({ where: { id } });
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
        `A brand with this ${
          slug ? `slug ("${slug}")` : 'name'
        } already exists.`,
      );
    }
    throw err;
  }
}
