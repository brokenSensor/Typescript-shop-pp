import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
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
  async createUser(dto: CreateUserDto): Promise<User> {
    const user = await this.userRepository.findOne({ email: dto.email });

    if (user) {
      throw new HttpException(
        {
          statusCode: HttpStatus.BAD_REQUEST,
          message: ['Email must be uniqe.'],
          error: 'Bad Request',
        },
        HttpStatus.BAD_REQUEST,
      );
    }
    return await this.userRepository.save(this.userRepository.create(dto));
  }

  async updateUser(dto: UpdateUserDto) {
    await this.userRepository.update(dto.id, dto);
    return this.getUserById(dto.id);
  }

  async getAllUsers() {
    return await this.userRepository.find();
  }

  async getUserById(id: number) {
    return await this.userRepository.findOne(id);
  }

  async getUserByEmail(email: string) {
    return await this.userRepository.findOne({ email });
  }
  async deleteUser(id: number) {
    await this.userRepository.delete({ id });
    return { message: 'User deleted' };
  }
}
