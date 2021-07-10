import {
  Body,
  Controller,
  Get,
  HttpStatus,
  Post,
  Request,
  UseGuards,
  ValidationPipe,
} from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
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
  async login(@Request() req) {
    return this.authService.login(req.user);
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
  register(@Body(new ValidationPipe()) createUserDto: CreateUserDto) {
    return this.authService.registerUser(createUserDto);
  }
}
