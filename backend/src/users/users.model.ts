import { ApiProperty } from '@nestjs/swagger';
import {
  BeforeInsert,
  BeforeUpdate,
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import * as bcrypt from 'bcrypt';
import { Product } from 'src/product/product.model';
import { Order } from 'src/order/order.model';

@Entity()
export class User {
  @ApiProperty({ example: '1', description: 'Unique identifier' })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({ example: 'Bob', description: 'User name' })
  @Column()
  name: string;

  @ApiProperty({ example: 'example@mail.com', description: 'Unique email' })
  @Column({ unique: true })
  email: string;

  @ApiProperty({ example: '12345678', description: 'User password' })
  @Column()
  password: string;

  @ApiProperty({
    example: 'false',
    description: 'Is this user an administrator',
  })
  @Column({ default: false })
  isAdmin: boolean;

  @ApiProperty({
    description: 'Products made by user',
  })
  @OneToMany(() => Product, (product) => product.user)
  products: Product[];

  @ApiProperty({
    description: 'Orders made by user',
  })
  @OneToMany(() => Order, (order) => order.user)
  orders: Order[];

  @CreateDateColumn({ type: 'timestamptz' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamptz' })
  updatedAt: Date;

  @BeforeInsert()
  @BeforeUpdate()
  private async hashPassword() {
    this.password = await bcrypt.hash(this.password, 10);
  }
}
