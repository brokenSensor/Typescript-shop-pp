import {
  Body,
  Controller,
  Param,
  Post,
  Put,
  Req,
  UseGuards,
  ValidationPipe,
} from '@nestjs/common';
import { IsAdminGuard } from 'src/auth/isAdmin.guard';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderToPayedDto } from './dto/update-order-to-payed.dto';
import { OrderService } from './order.service';

@Controller('order')
export class OrderController {
  constructor(private orderService: OrderService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  createOrder(
    @Body(new ValidationPipe()) orderDto: CreateOrderDto,
    @Req() req,
  ) {
    return this.orderService.createOrder(orderDto, req.user.sub);
  }

  @UseGuards(JwtAuthGuard)
  @Put('/pay/:orderId')
  updateOrderToPayed(
    @Body(new ValidationPipe()) paymentResult: UpdateOrderToPayedDto,
    @Param('orderId') orderId: number,
  ) {
    return this.orderService.updateOrderToPayed(paymentResult, orderId);
  }

  @UseGuards(IsAdminGuard)
  @Put('/delivered/:orderId')
  updateOrderToDelivered(@Param('orderId') orderId: number) {
    return this.orderService.updateOrderToDelivered(orderId);
  }
}
