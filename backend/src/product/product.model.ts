import { ApiProperty } from '@nestjs/swagger';
import { Review } from 'src/review/review.model';
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
export class Product {
  @ApiProperty({ example: '1', description: 'Unique identifier' })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({ description: 'Creator of product', type: User })
  @ManyToOne(() => User, (user) => user.products)
  user: () => User;

  @ApiProperty({ example: 'Phone', description: 'Name of the product' })
  @Column()
  name: string;

  @ApiProperty({
    example: 'phone.jpg',
    description: 'Name of image of product',
  })
  @Column()
  image: string;

  @ApiProperty({ example: 'Best Phones', description: 'Brand of the product' })
  @Column()
  brand: string;

  @ApiProperty({
    example: 'Mobile phones',
    description: 'Category of the product',
  })
  @Column()
  category: string;

  @ApiProperty({ description: 'Description of the product' })
  @Column()
  description: string;

  @ApiProperty({
    description: 'List of reviews of the product',
    type: [Review],
  })
  @OneToMany(() => Review, (review) => review.product)
  reviews: Review[];

  @ApiProperty({
    example: '5',
    description: 'Product rating based on average review scores',
  })
  @Column({ default: 0, type: 'decimal' })
  rating: number;

  @ApiProperty({
    description: 'Number of reviews',
  })
  @Column({ default: 0 })
  numReviews: number;

  @ApiProperty({
    example: '59',
    description: 'Price of the product',
  })
  @Column({ default: 0, type: 'decimal' })
  price: number;

  @ApiProperty({
    example: '5',
    description: 'Count in stock',
  })
  @Column({ default: 0 })
  countInStock: number;

  @CreateDateColumn({ type: 'timestamptz' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamptz' })
  updatedAt: Date;
}
