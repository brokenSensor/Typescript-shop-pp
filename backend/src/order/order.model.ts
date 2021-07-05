import { OrderItem } from 'src/order-item/order-item.model';
import { PaymentResult } from 'src/payment-result/payment-result.model';
import { ShippingAddress } from 'src/shipping-addres/shipping-address.model';
import { User } from 'src/users/users.model';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class Order {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, (user) => user.orders)
  user: User;

  @OneToMany(() => OrderItem, (orderItem) => orderItem.order)
  orderItems: OrderItem[];

  @OneToOne(() => ShippingAddress)
  @JoinColumn()
  shippingAddress: ShippingAddress;

  @Column()
  paymentMethod: string;

  @OneToOne(() => PaymentResult)
  @JoinColumn()
  paymentResult: PaymentResult;

  @Column({ default: 0.0 })
  taxPrice: number;

  @Column({ default: 0.0 })
  shippingPrice: number;

  @Column({ default: 0.0 })
  totlaPrice: number;

  @Column({ default: false })
  isPaid: boolean;

  @Column()
  paidAt: Date;

  @Column({ default: false })
  isDelivered: boolean;

  @Column()
  deliveredAt: Date;

  @CreateDateColumn({ type: 'timestamptz' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamptz' })
  updatedAt: Date;
}
