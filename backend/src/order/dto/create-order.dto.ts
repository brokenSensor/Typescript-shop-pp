import { IsString, IsDefined, IsInt } from 'class-validator';
import { User } from 'src/users/users.model';
import { OrderItem, PaymentResult, ShippingAddress } from '../order.model';

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
