import { Module } from '@nestjs/common';
import { OrderService } from './order.service';
import { OrderController } from './order.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/users/users.model';
import { Order } from './order.model';
import { AuthModule } from 'src/auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import { Product } from 'src/product/product.model';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, Order, Product]),
    AuthModule,
    ConfigModule,
  ],
  providers: [OrderService],
  controllers: [OrderController],
})
export class OrderModule {}
