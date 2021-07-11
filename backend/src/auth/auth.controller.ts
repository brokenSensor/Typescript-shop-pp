import {
  Body,
  Controller,
  HttpStatus,
  Post,
  Req,
  Res,
  UseGuards,
  ValidationPipe,
} from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Request, Response } from 'express';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from './local-auth.guard';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @ApiOperation({ summary: 'Login user' })
  @ApiResponse({
    status: HttpStatus.CREATED,
    schema: {
      properties: {
        access_token: { type: 'string', description: 'Users JWT Token' },
      },
    },
  })
  @UseGuards(LocalAuthGuard)
  @Post('/login')
  async login(@Req() req, @Res({ passthrough: true }) response: Response) {
    const body = await this.authService.login(req.user);
    response.cookie('refreshToken', body.refresh_token, {
      httpOnly: true,
      maxAge: 30 * 24 * 60 * 60 * 1000,
      path: '/',
      domain: 'localhost',
      sameSite: true,
      secure: true,
    });
    return body;
  }

  @ApiOperation({ summary: 'Register user' })
  @ApiResponse({
    status: HttpStatus.CREATED,
    schema: {
      properties: {
        token: { type: 'string', description: 'Users JWT Token' },
      },
    },
  })
  @Post('/register')
  async register(
    @Body(new ValidationPipe()) createUserDto: CreateUserDto,
    @Res({ passthrough: true }) response: Response,
  ) {
    const body = await this.authService.registerUser(createUserDto);
    response.cookie('refreshToken', body.refresh_token, {
      httpOnly: true,
      maxAge: 30 * 24 * 60 * 60 * 1000,
    });
    return body;
  }

  @ApiOperation({ summary: 'Refresh access token' })
  @ApiResponse({
    status: HttpStatus.CREATED,
    schema: {
      properties: {
        access_token: { type: 'string', description: 'Users JWT Token' },
      },
    },
  })
  @Post('/refresh')
  async refresh(
    @Req() req: Request,
    @Res({ passthrough: true }) response: Response,
  ) {
    const body = await this.authService.refresh(req.cookies['refreshToken']);
    response.cookie('refreshToken', body.refresh_token, {
      httpOnly: true,
      maxAge: 30 * 24 * 60 * 60 * 1000,
    });
    return body;
  }
}
