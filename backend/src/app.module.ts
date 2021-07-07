import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './users/users.model';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { ProductModule } from './product/product.module';
import { Product } from './product/product.model';
import { ReviewModule } from './review/review.module';
import { Review } from './review/review.model';
import { OrderModule } from './order/order.module';
import { Order } from './order/order.model';
import { PaymentResultModule } from './payment-result/payment-result.module';
import { PaymentResult } from './payment-result/payment-result.model';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: `.${process.env.NODE_ENV}.env`,
    }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.POSTGRES_HOST,
      port: Number(process.env.POSTGRES_PORT),
      username: process.env.POSTGRES_USER,
      password: process.env.POSTGRES_PASSWORD,
      database: process.env.POSTGRES_DB,
      entities: [User, Product, Review, Order, PaymentResult],
      synchronize: true,
      autoLoadEntities: true,
    }),
    UsersModule,
    AuthModule,
    ConfigModule,
    ProductModule,
    ReviewModule,
    OrderModule,
    PaymentResultModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
