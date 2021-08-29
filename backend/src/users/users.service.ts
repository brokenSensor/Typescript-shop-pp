import {
  BadRequestException,
  HttpException,
  HttpStatus,
  Injectable,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './users.model';
import * as bcrypt from 'bcrypt';
import { v4 } from 'uuid';
import { UserDTO } from 'src/auth/auth.service';

export type PaginatedUsers = {
  pages: number;
  page: number;
  users: User[];
};

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
  ) {}
  async createUser(dto: CreateUserDto): Promise<User> {
    const user = await this.userRepository.findOne({
      where: { email: dto.email },
    });

    if (!user) {
      const activationLink = v4();
      return await this.userRepository.save(
        this.userRepository.create({ ...dto, activationLink }),
      );
    }
    throw new BadRequestException({
      statusCode: HttpStatus.BAD_REQUEST,
      message: 'Email must be uniqe.',
      error: 'Bad Request',
    });
  }

  async updateUser(dto: UpdateUserDto, userId: number, isAdmin: boolean) {
    const userByEmail = await this.userRepository.findOne({
      where: {
        email: dto.email,
      },
    });
    const user = await this.userRepository.findOne(userId, {
      select: [
        'password',
        'name',
        'email',
        'isActivated',
        'activationLink',
        'isAdmin',
      ],
    });
    if (userByEmail && userByEmail.email && userByEmail.email !== user.email) {
      throw new BadRequestException({
        statusCode: HttpStatus.BAD_REQUEST,
        message: ['Email must be uniqe.'],
        error: 'Bad Request',
      });
    } else {
      if (dto.password) user.password = await bcrypt.hash(dto.password, 10);
      if (dto.name) user.name = dto.name;
      if (dto.email) {
        user.email = dto.email;
        user.isActivated = false;
        user.activationLink = v4();
      }
      if (dto.refresh_token) user.refresh_token = dto.refresh_token;
      if (isAdmin) {
        if (dto.isAdmin !== undefined) {
          user.isAdmin = dto.isAdmin;
        }
      }

      await this.userRepository.update(userId, user);
    }
  }

  async getAllUsers(pageNumber, keyword): Promise<PaginatedUsers> {
    const pageSize = 12;
    const page =
      pageNumber === 'undefined' || pageNumber === '' ? 1 : pageNumber;
    keyword = keyword === 'undefined' ? '' : keyword;

    const [users, count] = await this.userRepository
      .createQueryBuilder()
      .where('LOWER(name) LIKE :name', {
        name: `%${keyword.toLowerCase()}%`,
      })
      .take(pageSize)
      .skip(pageSize * (page - 1))
      .orderBy('id')
      .getManyAndCount();

    return { page, pages: Math.ceil(count / pageSize), users };
  }

  async getUserById(id: number): Promise<User> {
    return await this.userRepository.findOne(id);
  }

  async getUserByEmail(email: string): Promise<User> {
    return await this.userRepository.findOne({ where: { email } });
  }
  async deleteMe(id: number): Promise<{ message: string }> {
    await this.userRepository.delete(id);
    return { message: 'User deleted' };
  }
  async getUserByRefreshToken(refresh_token: string): Promise<User> {
    return await this.userRepository.findOne({
      where: {
        refresh_token,
      },
    });
  }

  async getCurrentUser(userId): Promise<UserDTO> {
    const user = await this.userRepository.findOne(userId);
    return new UserDTO(user);
  }
}
