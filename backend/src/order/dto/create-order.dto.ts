import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsDefined, IsInt } from 'class-validator';
import { OrderItem, ShippingAddress } from '../order.model';

export class CreateOrderDto {
  @ApiProperty({ description: 'List of orderd items', type: [Object] })
  @IsDefined()
  orderItems: OrderItem[];

  @ApiProperty({
    description: 'Shipping Address',
    type: Object,
  })
  @IsDefined()
  shippingAddress: ShippingAddress;

  @ApiProperty({
    description: 'Payment method',
    type: String,
  })
  @IsDefined()
  @IsString()
  paymentMethod: string;

  @ApiProperty({
    description: 'Tax price',
    type: Number,
  })
  @IsInt()
  taxPrice?: number;

  @ApiProperty({
    description: 'Shipping price',
    type: Number,
  })
  @IsInt()
  shippingPrice?: number;

  @ApiProperty({
    description: 'Total price',
    type: Number,
  })
  @IsDefined()
  @IsInt()
  totalPrice: number;
}
