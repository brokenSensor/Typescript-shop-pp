import { ApiProperty } from '@nestjs/swagger';
import { Product } from 'src/product/product.model';
import { User } from 'src/users/users.model';
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class Category {
  @ApiProperty({ example: '1', description: 'Unique identifier' })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({ description: 'Creator of category', type: () => User })
  @ManyToOne(() => User, (user) => user.orders)
  user: User;

  @ApiProperty({ description: 'Name of category' })
  @Column({ unique: true })
  name: string;

  @ApiProperty({
    description: 'Products of this category',
    type: () => [Product],
  })
  @OneToMany(() => Product, (product) => product.category)
  products: Product[];

  @CreateDateColumn({ type: 'timestamptz' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamptz' })
  updatedAt: Date;
}
