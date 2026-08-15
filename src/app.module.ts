import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { CategoriesModule } from './categories/categories.module';
import { BrandsModule } from './brands/brands.module';
import { CollectionsModule } from './collections/collections.module';
import { ProductsModule } from './products/products.module';
import { AuthModule } from './auth/auth.module';
import { CartModule } from './cart/cart.module';
import { OrdersModule } from './orders/orders.module';
import { CustomersModule } from './customers/customers.module';
import { SuppliersModule } from './suppliers/suppliers.module';
import { PurchaseOrdersModule } from './purchase-orders/purchase-orders.module';
import { StockMovementsModule } from './stock-movements/stock-movements.module';
import { UploadsModule } from './uploads/uploads.module';
import { UsersModule } from './users/users.module';
import { SiteModule } from './site/site.module';

@Module({
  imports: [
    PrismaModule,
    AuthModule,
    CategoriesModule,
    BrandsModule,
    CollectionsModule,
    ProductsModule,
    CartModule,
    OrdersModule,
    CustomersModule,
    SuppliersModule,
    PurchaseOrdersModule,
    StockMovementsModule,
    UploadsModule,
    UsersModule,
    SiteModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
