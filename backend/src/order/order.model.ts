import { ApiProperty } from '@nestjs/swagger';
import { User } from 'src/users/users.model';
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

export interface OrderItem {
  name: string;

  qty: number;

  image: string;

  price: number;

  productId: number;
}

export interface ShippingAddress {
  address: string;

  city: string;

  postalCode: string;

  country: string;
}

export interface PaymentResult {
  status: string;

  update_time: string;

  email_address: string;
}

@Entity()
export class Order {
  @ApiProperty({ example: '1', description: 'Unique identifier' })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({ description: 'Creator of order', type: () => User })
  @ManyToOne(() => User, (user) => user.orders)
  user: User;

  @ApiProperty({ description: 'List of orderd items', type: [Object] })
  @Column({ type: 'jsonb', array: false })
  orderItems: OrderItem[];

  @ApiProperty({
    description: 'Shipping Address',
    type: Object,
  })
  @Column({ type: 'jsonb', array: false })
  shippingAddress: ShippingAddress;

  @ApiProperty({
    description: 'Payment method',
    type: String,
  })
  @Column()
  paymentMethod: string;

  @ApiProperty({
    description: 'Payment result',
    type: Object,
  })
  @Column({ type: 'jsonb', array: false, nullable: true })
  paymentResult: PaymentResult;

  @ApiProperty({
    description: 'Tax price',
    type: Number,
  })
  @Column({ default: 0.0, type: 'decimal' })
  taxPrice: number;

  @ApiProperty({
    description: 'Shipping price',
    type: Number,
  })
  @Column({ default: 0.0, type: 'decimal' })
  shippingPrice: number;

  @ApiProperty({
    description: 'Total price',
    type: Number,
  })
  @Column({ default: 0.0, type: 'decimal' })
  totalPrice: number;

  @ApiProperty({
    description: 'Is order is paid',
    type: Boolean,
  })
  @Column({ default: false, nullable: true })
  isPaid: boolean;

  @ApiProperty({
    description: 'Date at which order is paid',
    type: Date,
  })
  @Column({ nullable: true })
  paidAt: Date;

  @ApiProperty({
    description: 'Is order is delivered. Sets by admin',
    type: Boolean,
  })
  @Column({ default: false })
  isDelivered: boolean;

  @ApiProperty({
    description: 'Date at which order is delivered',
    type: Date,
  })
  @Column({ nullable: true })
  deliveredAt: Date;

  @CreateDateColumn({ type: 'timestamptz' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamptz' })
  updatedAt: Date;
}
