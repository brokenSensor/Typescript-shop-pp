import { BadRequestException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { Request } from 'express-serve-static-core';
import { UserDTO } from 'src/auth/auth.service';
import { User } from 'src/users/users.model';
import { Repository } from 'typeorm';
import { CreateOrderDto } from './dto/create-order.dto';
import { Order, PaymentResult } from './order.model';
import * as paypal from '@paypal/checkout-server-sdk';
// import paypal from 'paypal__checkout-server-sdk';

export type PaginatedOrders = {
  pages: number;
  page: number;
  orders: Order[];
};

@Injectable()
export class OrderService {
  constructor(
    @InjectRepository(Order) private orderRepository: Repository<Order>,
    @InjectRepository(User) private userRepository: Repository<User>,
    private configService: ConfigService,
  ) {}

  async createOrder(dto: CreateOrderDto, userId: number): Promise<Order> {
    const order = this.orderRepository.create({});
    if (dto.taxPrice) order.taxPrice = dto.taxPrice;
    if (dto.shippingPrice) order.shippingPrice = dto.shippingPrice;
    order.totalPrice = dto.totalPrice;
    order.paymentMethod = dto.paymentMethod;
    order.user = await this.userRepository.findOne(userId);
    order.shippingAddress = dto.shippingAddress;
    order.itemsPrice = dto.itemsPrice;

    const orderItems = [];
    dto.orderItems.forEach((item) => {
      orderItems.push(item);
    });

    order.orderItems = orderItems;
    await this.orderRepository.save(order);

    return await this.orderRepository.findOne({ where: { id: order.id } });
  }

  async getOrderById(oredrId: number): Promise<Order> {
    const order = await this.orderRepository.findOne({
      where: {
        id: oredrId,
      },
      relations: ['user'],
    });
    if (!order) {
      throw new BadRequestException();
    }
    return order;
  }

  async getAllOrders(pageNumber, keyword): Promise<PaginatedOrders> {
    const pageSize = 12;
    const page =
      pageNumber === 'undefined' || pageNumber === '' ? 1 : pageNumber;
    keyword = keyword === 'undefined' ? '' : keyword;

    const [orders, count] = await this.orderRepository
      .createQueryBuilder('order')
      .leftJoinAndSelect('order.user', 'user')
      // .where('LOWER(name) LIKE :name', {
      //   name: `%${keyword.toLowerCase()}%`,
      // })
      .take(pageSize)
      .skip(pageSize * (page - 1))
      .orderBy('order.id')
      .getManyAndCount();

    return { page, pages: Math.ceil(count / pageSize), orders };
  }

  async getAllMyOrders(req): Promise<Order[]> {
    return this.orderRepository.find({ where: { user: req.user.id } });
  }

  async updateOrderToPayed(
    paymentResult: PaymentResult,
    orderId: number,
  ): Promise<Order> {
    const order = await this.orderRepository.findOne(orderId);

    order.paymentResult = paymentResult;
    order.isPaid = true;
    order.paidAt = new Date();

    return this.orderRepository.save(order);
  }

  async updateOrderToDelivered(orderId: number): Promise<Order> {
    const order = await this.orderRepository.findOne({
      where: { id: orderId },
    });

    order.isDelivered = true;
    order.deliveredAt = new Date();

    return this.orderRepository.save(order);
  }

  getPayPalConfig(): { clientId: string } {
    const clientId = this.configService.get('PAYPAL_CLIENT_ID');
    return { clientId };
  }

  async createPayPalOrder(orderId: number): Promise<{ orderId: string }> {
    const Environment =
      process.env.NODE_ENV === 'production'
        ? paypal.core.LiveEnvironment
        : paypal.core.SandboxEnvironment;

    const paypalClient = new paypal.core.PayPalHttpClient(
      new Environment(
        this.configService.get('PAYPAL_CLIENT_ID'),
        this.configService.get('PAYPAL_CLIENT_SECRET'),
      ),
    );
    const order = await this.orderRepository.findOne({
      where: { id: orderId },
    });

    const request = new paypal.orders.OrdersCreateRequest();
    request.prefer('return=representation');
    request.requestBody({
      intent: 'CAPTURE',
      purchase_units: [
        {
          amount: {
            currency_code: 'USD',
            value: order.totalPrice,
            breakdown: {
              shipping: {
                currency_code: 'USD',
                value: order.shippingPrice,
              },
              tax_total: {
                currency_code: 'USD',
                value: order.taxPrice,
              },
              item_total: {
                currency_code: 'USD',
                value: order.itemsPrice,
              },
            },
          },
          items: order.orderItems.map((item) => {
            return {
              name: item.name,
              unit_amount: {
                currency_code: 'USD',
                value: item.price,
              },
              quantity: item.qty,
            };
          }),
        },
      ],
    });

    const orderPP = await paypalClient.execute(request);
    console.log(orderPP);
    const orderPPId: string = orderPP.result.id;
    return { orderId: orderPPId };
  }
}
