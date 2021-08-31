import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { User } from 'src/users/users.model';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TokensAndUser, UserDTO } from 'src/types';
import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';
import { emailHTMLMaker } from './emailHTML';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    @InjectRepository(User) private userRepository: Repository<User>,
    private configService: ConfigService,
  ) {}

  async validateUser(email: string, pass: string): Promise<UserDTO> {
    const user = await this.userRepository.findOne({
      where: { email: email },
      select: [
        'password',
        'id',
        'name',
        'email',
        'isAdmin',
        'createdAt',
        'updatedAt',
        'isActivated',
      ],
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
    await this.usersService.updateUser(
      { refresh_token },
      userDto.id,
      userDto.isAdmin,
    );
    return {
      user: { ...userDto },
      access_token,
      refresh_token,
    };
  }

  async logout(refresh_token: string): Promise<void> {
    const user = await this.userRepository.findOne({
      where: { refresh_token: refresh_token },
    });
    if (!user) {
      throw new BadRequestException();
    }
    user.refresh_token = null;
    await this.userRepository.save(user);
  }

  async registerUser(createUserDto: CreateUserDto) {
    const user = await this.usersService.createUser(createUserDto);
    await this.sendActivationEmail(user.name, user.email, user.activationLink);
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
    const checkUser = await this.userRepository.findOne({
      where: { refresh_token: refresh_token },
      select: [
        'refresh_token',
        'id',
        'name',
        'email',
        'isAdmin',
        'createdAt',
        'updatedAt',
        'isActivated',
      ],
    });

    const validatedToken = this.jwtService.verify(refresh_token);

    if (validatedToken && checkUser && checkUser.refresh_token) {
      const userDto = new UserDTO(checkUser);
      const tokens = this.generateTokens({ ...userDto });
      this.usersService.updateUser(
        { refresh_token: tokens.refresh_token },
        userDto.id,
        userDto.isAdmin,
      );
      return {
        user: { ...userDto },
        access_token: tokens.access_token,
        refresh_token: tokens.refresh_token,
      };
    }
    throw new UnauthorizedException();
  }

  async sendActivationEmail(
    name: string,
    email: string,
    activationLink: string,
  ): Promise<void> {
    const transporter = nodemailer.createTransport({
      host: this.configService.get('SMTP_HOST'),
      port: this.configService.get('SMTP_PORT'),
      secure: true,
      auth: {
        user: this.configService.get('SMTP_USER'),
        pass: this.configService.get('SMTP_PASSWORD'),
      },
    });

    transporter.sendMail({
      from: this.configService.get('SMTP_USER'),
      to: email,
      subject: `Account activation for ${this.configService.get('SITE_URL')}`,
      text: '',
      html: emailHTMLMaker(
        name,
        `${this.configService.get(
          'API_URL',
        )}/auth/emailActivation/${activationLink}`,
      ),
    });
  }

  async emailActivation(activationLink: string): Promise<'success' | 'failed'> {
    const user = await this.usersService.getUserByActivationLink(
      activationLink,
    );
    if (user) {
      user.isActivated = true;
      await this.userRepository.save(user);
      return 'success';
    } else {
      return 'failed';
    }
  }

  async resendActivationEmail(userId): Promise<void> {
    const user = await this.userRepository.findOne({
      where: { id: userId },
      select: ['name', 'email', 'activationLink'],
    });

    if (user) {
      this.sendActivationEmail(user.name, user.email, user.activationLink);
    }
  }
}
