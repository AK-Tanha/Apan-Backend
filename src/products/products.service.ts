import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';

@Injectable()
export class ProductsService {
  constructor(private prisma: PrismaService) {}

  create(dto: CreateProductDto) {
    const { imageUrls, variants, categoryId, ...rest } = dto;

    return this.prisma.product.create({
      data: {
        ...rest,
        category: { connect: { id: categoryId } },
        images: imageUrls
          ? { create: imageUrls.map((url) => ({ url })) }
          : undefined,
        variants: { create: variants },
      },
      include: { images: true, variants: true, category: true },
    });
  }

  findAll() {
    return this.prisma.product.findMany({
      where: { isActive: true },
      include: { images: true, variants: true, category: true },
    });
  }

  async findOne(id: string) {
    const product = await this.prisma.product.findUnique({
      where: { id },
      include: { images: true, variants: true, category: true },
    });
    if (!product) throw new NotFoundException(`Product ${id} not found`);
    return product;
  }

  async update(id: string, dto: UpdateProductDto) {
    await this.findOne(id);
    const { imageUrls, variants, categoryId, ...rest } = dto;
    return this.prisma.product.update({
      where: { id },
      data: {
        ...rest,
        ...(categoryId && { category: { connect: { id: categoryId } } }),
      },
      include: { images: true, variants: true, category: true },
    });
  }

  async remove(id: string) {
    await this.findOne(id);
    return this.prisma.product.delete({ where: { id } });
  }
}