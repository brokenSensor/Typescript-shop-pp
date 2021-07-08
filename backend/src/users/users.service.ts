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

  async updateUser(dto: UpdateUserDto, userId: number): Promise<User> {
    const userByEmail = await this.userRepository.findOne({ email: dto.email });
    if (userByEmail) {
      throw new HttpException(
        {
          statusCode: HttpStatus.BAD_REQUEST,
          message: ['Email must be uniqe.'],
          error: 'Bad Request',
        },
        HttpStatus.BAD_REQUEST,
      );
    } else {
      const user = await this.userRepository.findOne(userId);
      if (dto.password) user.password = dto.password;
      user.name = dto.name;
      user.email = dto.email;
      return await this.userRepository.save(user);
    }
  }

  async getAllUsers(): Promise<User[]> {
    return await this.userRepository.find();
  }

  async getUserById(id: number): Promise<User> {
    return await this.userRepository.findOne(id);
  }

  async getUserByEmail(email: string): Promise<User> {
    return await this.userRepository.findOne({ email });
  }
  async deleteMe(id): Promise<{ message: string }> {
    try {
      await this.userRepository.delete(id);
      return { message: 'User deleted' };
    } catch (error) {
      return error;
    }
  }
}
