import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/users/users.model';
import { Repository } from 'typeorm';
import { CreateOrderDto } from './dto/create-order.dto';
import { Order, PaymentResult } from './order.model';

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

  async updateOrderToPayed(
    paymenResult: PaymentResult,
    orderId: number,
  ): Promise<Order> {
    const order = await this.orderRepository.findOne(orderId);

    order.paymentResult = paymenResult;
    order.isPaid = true;
    order.paidAt = new Date();

    return this.orderRepository.save(order);
  }

  async updateOrderToDelivered(orderId: number): Promise<Order> {
    const order = await this.orderRepository.findOne(orderId);

    order.isDelivered = true;
    order.deliveredAt = new Date();

    return this.orderRepository.save(order);
  }
}
