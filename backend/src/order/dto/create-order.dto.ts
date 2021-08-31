import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsDefined, IsInt, IsNumber } from 'class-validator';
import { OrderItem, ShippingAddress } from 'types';

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
    description: 'Items price',
    type: Number,
  })
  @IsNumber()
  itemsPrice: number;

  @ApiProperty({
    description: 'Tax price',
    type: Number,
  })
  @IsNumber()
  taxPrice?: number;

  @ApiProperty({
    description: 'Shipping price',
    type: Number,
  })
  @IsNumber()
  shippingPrice?: number;

  @ApiProperty({
    description: 'Total price',
    type: Number,
  })
  @IsDefined()
  @IsNumber()
  totalPrice: number;
}
