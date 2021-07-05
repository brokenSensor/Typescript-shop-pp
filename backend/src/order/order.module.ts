import { Module } from '@nestjs/common';
import { OrderService } from './order.service';
import { OrderController } from './order.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/users/users.model';
import { Order } from './order.model';
import { OrderItem } from 'src/order-item/order-item.model';
import { ShippingAddress } from 'src/shipping-addres/shipping-address.model';
import { PaymentResult } from 'src/payment-result/payment-result.model';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      User,
      Order,
      OrderItem,
      ShippingAddress,
      PaymentResult,
    ]),
  ],
  providers: [OrderService],
  controllers: [OrderController],
})
export class OrderModule {}
