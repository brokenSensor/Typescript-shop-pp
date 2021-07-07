import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/users/users.model';
import { Repository } from 'typeorm';
import { CreateOrderDto } from './dto/create-order.dto';
import { Order } from './order.model';

@Injectable()
export class OrderService {
  constructor(
    @InjectRepository(Order) private orderRepository: Repository<Order>,
    @InjectRepository(User) private userRepository: Repository<User>,
  ) {}

  async createOrder(dto: CreateOrderDto, userId: number): Promise<Order> {
    const order = this.orderRepository.create({});
    if (dto.taxPrice) order.taxPrice = dto.taxPrice;
    if (dto.shippingPrice) order.shippingPrice = dto.shippingPrice;
    order.totalPrice = dto.totalPrice;
    order.paymentMethod = dto.paymentMethod;
    order.user = await this.userRepository.findOne(userId);
    order.shippingAddress = dto.shippingAddress;

    const orderItems = [];
    dto.orderItems.forEach((item) => {
      orderItems.push(item);
    });

    order.orderItems = orderItems;

    return await this.orderRepository.save(order);
  }
}
