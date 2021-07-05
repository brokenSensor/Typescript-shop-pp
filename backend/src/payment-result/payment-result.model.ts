import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class PaymentResult {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  status: string;

  @Column()
  update_time: string;

  @Column()
  email_address: string;
}
