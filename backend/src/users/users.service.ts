import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { User } from './users.model';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
  ) {}
  async createUser(dto: CreateUserDto) {
    const newUser = this.userRepository.create(dto);

    newUser.password = await bcrypt.hash(newUser.password, 10);

    await this.userRepository.save(newUser);

    return newUser;
  }

  async getAllUsers() {
    return this.userRepository.find();
  }
}
