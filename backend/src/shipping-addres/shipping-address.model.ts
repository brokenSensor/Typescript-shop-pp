import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class ShippingAddress {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  address: string;

  @Column()
  city: string;

  @Column()
  postalCode: string;

  @Column()
  country: string;
}
