import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { UpdateSiteDto } from './dto/update-site.dto';

@Injectable()
export class SiteService {
  constructor(private prisma: PrismaService) {}

  async get() {
    return this.prisma.siteSetting.upsert({
      where: { id: 'default' },
      update: {},
      create: { id: 'default' },
    });
  }

  async update(dto: UpdateSiteDto) {
    return this.prisma.siteSetting.upsert({
      where: { id: 'default' },
      update: {
        ...(dto.siteName !== undefined && { siteName: dto.siteName }),
        ...(dto.logoUrl !== undefined && { logoUrl: dto.logoUrl }),
        ...(dto.description !== undefined && { description: dto.description }),
      },
      create: {
        id: 'default',
        ...(dto.siteName !== undefined && { siteName: dto.siteName }),
        ...(dto.logoUrl !== undefined && { logoUrl: dto.logoUrl }),
        ...(dto.description !== undefined && { description: dto.description }),
      },
    });
  }
}
