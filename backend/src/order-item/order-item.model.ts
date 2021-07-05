import { Order } from 'src/order/order.model';
import { Product } from 'src/product/product.model';

import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class OrderItem {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Order, (order) => order.orderItems)
  order: Order;

  @Column()
  name: string;

  @Column()
  qty: number;

  @Column()
  image: string;

  @Column()
  price: number;

  @ManyToOne(() => Product)
  product: Product;
}
