import {
  Body,
  Controller,
  Get,
  HttpStatus,
  Param,
  Post,
  Req,
  Res,
  UseGuards,
  ValidationPipe,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Request, Response } from 'express';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { AuthService } from './auth.service';
import { GoogleAuthGuard } from './guards/google-auth.guard';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { LocalAuthGuard } from './guards/local-auth.guard';

@ApiTags('Auth')
@Controller('api/auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private configService: ConfigService,
  ) {}

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
    status: HttpStatus.OK,
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

  @ApiOperation({ summary: 'Resend email activation mail' })
  @ApiResponse({
    status: HttpStatus.OK,
  })
  @UseGuards(JwtAuthGuard)
  @Get('/emailActivation')
  async resendActivationEmail(@Req() req) {
    this.authService.resendActivationEmail(req.user.id);
  }

  @ApiOperation({ summary: 'Email activation' })
  @ApiResponse({
    status: HttpStatus.OK,
  })
  @Get('/emailActivation/:activationLink')
  async emailActivation(
    @Param('activationLink') activationLink: string,
    @Res({ passthrough: true }) response: Response,
  ) {
    const result: 'success' | 'failed' = await this.authService.emailActivation(
      activationLink,
    );

    response.redirect(
      `${this.configService.get('SITE_URL')}/activation/${result}`,
    );
  }

  @ApiOperation({ summary: 'Get Google Client Id' })
  @ApiResponse({
    status: HttpStatus.OK,
  })
  @Get('/googleId')
  async getGoogleClientId() {
    return { googleClientId: this.configService.get('GOOGLE_CLIENT_ID') };
  }

  @Get('/google')
  @UseGuards(GoogleAuthGuard)
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  async googleAuth(@Req() req) {}

  @Get('/google/callback')
  @UseGuards(GoogleAuthGuard)
  async googleAuthRedirect(@Req() req, @Res() response: Response) {
    const tokensAndUser = await this.authService.login(req.user);
    response.cookie('refreshToken', tokensAndUser.refresh_token, {
      httpOnly: true,
      maxAge: 30 * 24 * 60 * 60 * 1000,
    });
    response.redirect(
      `${this.configService.get(
        'SITE_URL',
      )}/login?tokensAndUser=${JSON.stringify(tokensAndUser)}`,
    );
    return req.user;
  }

  @Get('googleURL')
  googleURL() {
    return { URL: `${this.configService.get('API_URL')}/api/auth/google` };
  }
}
