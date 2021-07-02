import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './users.model';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
  ) {}
  async createUser(dto: CreateUserDto) {
    return await this.userRepository.save(this.userRepository.create(dto));
  }

  async updateUser(dto: UpdateUserDto) {
    return await this.userRepository.update(dto.id, dto);
  }

  async getAllUsers() {
    return this.userRepository.find();
  }
}
