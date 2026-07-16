import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { CategoriesModule } from './categories/categories.module';
import { ProductsModule } from './products/products.module';
import { AuthModule } from './auth/auth.module';
import { CartModule } from './cart/cart.module';
import { OrdersModule } from './orders/orders.module';
import { CustomersModule } from './customers/customers.module';
import { VendorsModule } from './vendors/vendors.module';
import { PurchaseOrdersModule } from './purchase-orders/purchase-orders.module';

@Module({
  imports: [PrismaModule, AuthModule, CategoriesModule, ProductsModule, CartModule, OrdersModule, CustomersModule, VendorsModule, PurchaseOrdersModule],
  controllers: [AppController],
  providers: [AppService],
})

@Module({
  imports: [PrismaModule],
})
export class AppModule {}