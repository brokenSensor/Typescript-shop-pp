import { Review } from 'src/review/review.model';
import { User } from 'src/users/users.model';
import {
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
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

  @Column()
  rating: string;
}
