import {
  Body,
  Controller,
  Post,
  Req,
  UseGuards,
  ValidationPipe,
} from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { CreateOrderDto } from './dto/create-order.dto';
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
}
