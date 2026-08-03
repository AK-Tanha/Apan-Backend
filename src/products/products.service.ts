import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { QueryProductDto } from './dto/query-product.dto';
import { Prisma } from '@prisma/client';

@Injectable()
export class ProductsService {
  constructor(private prisma: PrismaService) {}

  private buildImageData(
    imageUrls?: string[],
    heroImageUrl?: string,
  ): { url: string; isHero: boolean }[] | undefined {
    if (!imageUrls || imageUrls.length === 0) return undefined;
    const hero = imageUrls.includes(heroImageUrl ?? '')
      ? heroImageUrl
      : imageUrls[0];
    return imageUrls.map((url) => ({ url, isHero: url === hero }));
  }

  create(dto: CreateProductDto) {
    const {
      imageUrls,
      heroImageUrl,
      variants,
      categoryId,
      supplierId,
      ...rest
    } = dto;
    const images = this.buildImageData(imageUrls, heroImageUrl);

    return this.prisma.product.create({
      data: {
        ...rest,
        category: { connect: { id: categoryId } },
        ...(supplierId && { suplier: { connect: { id: supplierId } } }),
        ...(images && { images: { create: images } }),
        variants: { create: variants },
      },
      include: { images: true, variants: true, category: true },
    });
  }

  // ...

  async findAll(query: QueryProductDto) {
    const {
      search,
      categoryId,
      size,
      color,
      minPrice,
      maxPrice,
      page = 1,
      limit = 20,
    } = query;

    const where: Prisma.ProductWhereInput = {
      isActive: true,
      ...(search && { name: { contains: search, mode: 'insensitive' } }),
      ...(categoryId && { categoryId }),
      ...(minPrice !== undefined && { basePrice: { gte: minPrice } }),
      ...(maxPrice !== undefined && { basePrice: { lte: maxPrice } }),
      ...((size || color) && {
        variants: {
          some: {
            ...(size && { size }),
            ...(color && { color }),
          },
        },
      }),
    };

    const [products, total] = await this.prisma.$transaction([
      this.prisma.product.findMany({
        where,
        include: { images: true, variants: true, category: true },
        skip: (page - 1) * limit,
        take: limit,
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.product.count({ where }),
    ]);

    return {
      data: products,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
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

    const {
      imageUrls,
      heroImageUrl,
      variants, // eslint-disable-line @typescript-eslint/no-unused-vars -- not editable via this endpoint
      categoryId,
      supplierId,
      ...rest
    } = dto;
    const images = this.buildImageData(imageUrls, heroImageUrl);

    return this.prisma.product.update({
      where: { id },
      data: {
        ...rest,
        ...(categoryId && { category: { connect: { id: categoryId } } }),
        ...(supplierId && { suplier: { connect: { id: supplierId } } }),
        ...(images && {
          images: {
            deleteMany: {},
            create: images,
          },
        }),
      },
      include: { images: true, variants: true, category: true },
    });
  }

  async remove(id: string) {
    await this.findOne(id);
    return this.prisma.product.delete({ where: { id } });
  }
}
