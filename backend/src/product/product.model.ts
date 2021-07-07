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
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, (user) => user.products)
  user: User;

  @Column()
  name: string;

  @Column()
  image: string;

  @Column()
  brand: string;

  @Column()
  category: string; //!!!!

  @Column()
  description: string;

  @OneToMany(() => Review, (review) => review.product)
  reviews: Review[];

  @Column({ default: 0, type: 'decimal' })
  rating: number;

  @Column({ default: 0 })
  numReviews: number;

  @Column({ default: 0, type: 'decimal' })
  price: number;

  @Column({ default: 0 })
  countInStock: number;

  @CreateDateColumn({ type: 'timestamptz' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamptz' })
  updatedAt: Date;
}
