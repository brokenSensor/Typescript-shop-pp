import { IsString, IsDefined, IsInt } from 'class-validator';
import { PaymentResult } from 'src/payment-result/payment-result.model';
import { User } from 'src/users/users.model';
import { OrderItem, ShippingAddress } from '../order.model';

export class CreateOrderDto {
  user?: User;

  @IsDefined()
  orderItems: OrderItem[];

  @IsDefined()
  shippingAddress: ShippingAddress;

  paymentResult?: PaymentResult;

  @IsDefined()
  @IsString()
  paymentMethod: string;

  taxPrice?: number;

  shippingPrice?: number;

  @IsDefined()
  @IsInt()
  totalPrice: number;
}
