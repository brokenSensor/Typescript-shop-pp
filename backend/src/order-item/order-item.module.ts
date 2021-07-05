import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Order } from 'src/order/order.model';
import { Product } from 'src/product/product.model';
import { OrderItemController } from './order-item.controller';
import { OrderItem } from './order-item.model';
import { OrderItemService } from './order-item.service';

@Module({
  imports: [TypeOrmModule.forFeature([Order, OrderItem, Product])],
  providers: [OrderItemService],
  controllers: [OrderItemController],
})
export class OrderItemModule {}
