import {
  HttpException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { User } from 'src/users/users.model';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

export interface TokensAndUser {
  user: UserDTO;
  access_token: string;
  refresh_token: string;
}

export class UserDTO {
  constructor(user: User) {
    this.id = user.id;
    this.name = user.name;
    this.email = user.email;
    this.isAdmin = user.isAdmin;
    this.createdAt = user.createdAt;
    this.updatedAt = user.updatedAt;
  }
  id: number;
  name: string;
  email: string;
  isAdmin: boolean;
  createdAt: Date;
  updatedAt: Date;
}

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    private configService: ConfigService,
    @InjectRepository(User) private userRepository: Repository<User>,
  ) {}

  async validateUser(email: string, pass: string): Promise<UserDTO> {
    const user = await this.userRepository.findOne({
      where: { email: email },
    });
    if (!user) throw new UnauthorizedException();
    const passMatches = await bcrypt.compare(pass, user.password);
    if (user && passMatches) {
      const userDto = new UserDTO(user);
      return { ...userDto };
    }
    return null;
  }

  async login(userDto: UserDTO): Promise<TokensAndUser> {
    const { access_token, refresh_token } = this.generateTokens(userDto);
    this.usersService.updateUser({ refresh_token }, userDto.id);
    return {
      user: { ...userDto },
      access_token,
      refresh_token,
    };
  }

  async logout(refresh_token: string): Promise<void> {
    const user = await this.usersService.getUserByRefreshToken(refresh_token);
    user.refresh_token = null;
    await this.userRepository.save(user);
  }

  async registerUser(createUserDto: CreateUserDto) {
    const user = await this.usersService.createUser(createUserDto);
    if (user) {
      const userDto = new UserDTO(user);
      return this.login({ ...userDto });
    }
  }

  generateTokens(payload) {
    const access_token = this.jwtService.sign(payload, { expiresIn: '30m' });
    const refresh_token = this.jwtService.sign(payload, { expiresIn: '30d' });
    return {
      access_token,
      refresh_token,
    };
  }

  async refresh(refresh_token: string): Promise<TokensAndUser> {
    const checkUser = await this.usersService.getUserByRefreshToken(
      refresh_token,
    );

    const validatedToken = this.jwtService.verify(refresh_token);

    if (validatedToken && checkUser && checkUser.refresh_token) {
      const userDto = new UserDTO(checkUser);
      const tokens = this.generateTokens({ ...userDto });
      this.usersService.updateUser(
        { refresh_token: tokens.refresh_token },
        userDto.id,
      );
      return {
        user: { ...userDto },
        access_token: tokens.access_token,
        refresh_token: tokens.refresh_token,
      };
    }
    throw new UnauthorizedException();
  }
}
