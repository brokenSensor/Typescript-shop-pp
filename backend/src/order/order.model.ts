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
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, (user) => user.orders)
  user: User;

  @Column({ type: 'jsonb', array: false })
  orderItems: OrderItem[];

  @Column({ type: 'jsonb', array: false })
  shippingAddress: ShippingAddress;

  @Column()
  paymentMethod: string;

  @Column({ type: 'jsonb', array: false, nullable: true })
  paymentResult: PaymentResult;

  @Column({ default: 0.0, type: 'decimal' })
  taxPrice: number;

  @Column({ default: 0.0, type: 'decimal' })
  shippingPrice: number;

  @Column({ default: 0.0, type: 'decimal' })
  totalPrice: number;

  @Column({ default: false, nullable: true })
  isPaid: boolean;

  @Column({ nullable: true })
  paidAt: Date;

  @Column({ default: false })
  isDelivered: boolean;

  @Column({ nullable: true })
  deliveredAt: Date;

  @CreateDateColumn({ type: 'timestamptz' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamptz' })
  updatedAt: Date;
}
