import {
  BadRequestException,
  Body,
  Controller,
  Get,
  HttpException,
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
    });
    return body;
  }

  @ApiOperation({ summary: 'Logout user' })
  @ApiResponse({
    status: HttpStatus.CREATED,
  })
  @Post('/logout')
  async logout(
    @Req() req: Request,
    @Res({ passthrough: true }) response: Response,
  ) {
    const refreshToken = req.cookies['refreshToken'];
    await this.authService.logout(refreshToken);
    response.clearCookie('refreshToken');
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
    if (body) {
      response.cookie('refreshToken', body.refresh_token, {
        httpOnly: true,
        maxAge: 30 * 24 * 60 * 60 * 1000,
      });
      return body;
    }
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
  @Get('/refresh')
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
