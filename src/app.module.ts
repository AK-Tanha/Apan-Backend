import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { CategoriesModule } from './categories/categories.module';
import { ProductsModule } from './products/products.module';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [PrismaModule, CategoriesModule, ProductsModule, AuthModule],
  controllers: [AppController],
  providers: [AppService],
})

@Module({
  imports: [PrismaModule],
})
export class AppModule {}