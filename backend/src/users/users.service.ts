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
    const user = await this.getUserById(userId);
    const userByEmail = await this.userRepository.findOne({ email: dto.email });
    if (!user) {
      throw new HttpException(
        {
          statusCode: HttpStatus.NOT_FOUND,
          message: ['User not found.'],
          error: 'Not Found',
        },
        HttpStatus.NOT_FOUND,
      );
    } else if (userByEmail.id !== user.id) {
      throw new HttpException(
        {
          statusCode: HttpStatus.BAD_REQUEST,
          message: ['Email must be uniqe.'],
          error: 'Bad Request',
        },
        HttpStatus.BAD_REQUEST,
      );
    } else {
      await this.userRepository.update(userId, dto);
      return this.getUserById(userId);
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
  async deleteUser(id: number): Promise<{ message: string }> {
    const user = await this.userRepository.findOne(id);

    if (!user || !id) {
      throw new HttpException(
        {
          statusCode: HttpStatus.NOT_FOUND,
          message: ['Product not found.'],
          error: 'Not Found',
        },
        HttpStatus.NOT_FOUND,
      );
    } else {
      this.userRepository.delete(id);
      return { message: 'User deleted' };
    }
  }
}
