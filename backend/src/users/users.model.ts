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

  @ApiProperty({ example: 'local', description: 'Auth strategy' })
  @Column()
  strategy: string;

  @ApiProperty({ example: 'Bob', description: 'User name' })
  @Column()
  name: string;

  @ApiProperty({ example: 'example@mail.com', description: 'Unique email' })
  @Column({ unique: true })
  email: string;

  @ApiProperty({
    description: 'Uuid link for email activation',
  })
  @Column({ select: false, nullable: true })
  activationLink: string;

  @ApiProperty({
    description: 'Is email activated',
  })
  @Column({ default: false })
  isActivated: boolean;

  @ApiProperty({ example: '12345678', description: 'User password' })
  @Column({ select: false, nullable: true })
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
  @ApiProperty({
    example:
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJuYW1lIjoiQm9iaSBGb28iLCJlbWFpbCI6ImJvYnNhYUBtYWlsLmNvbSIsImlkIjoxNywiaXNBZG1pbiI6ZmFsc2UsImNyZWF0ZWRBdCI6IjIwMjEtMDctMTFUMDQ6NTM6NDQuMTIzWiIsInVwZGF0ZWRBdCI6IjIwMjEtMDctMTFUMDQ6NTM6NDQuMTIzWiIsImlhdCI6MTYyNTk3OTIyNCwiZXhwIjoxNjI1OTgxMDI0fQ.4u4X0anANiVdpyiCgClK6jLu4-qZv1SUPxLeDeM0HA8',
    description: 'Refresh token',
  })
  @Column({ default: null, nullable: true, select: false })
  refresh_token: string;

  @CreateDateColumn({ type: 'timestamptz' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamptz' })
  updatedAt: Date;

  @BeforeInsert()
  private async hashPassword() {
    if (this.password) {
      this.password = await bcrypt.hash(this.password, 10);
    }
  }
}
