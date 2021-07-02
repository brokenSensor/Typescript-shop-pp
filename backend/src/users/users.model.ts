import { ApiProperty } from '@nestjs/swagger';
import {
  BeforeInsert,
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import * as bcrypt from 'bcrypt';

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

  @CreateDateColumn({ type: 'timestamptz' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamptz' })
  updatedAt: Date;

  @BeforeInsert()
  private async hashPassword() {
    this.password = await bcrypt.hash(this.password, 10);
  }
}
