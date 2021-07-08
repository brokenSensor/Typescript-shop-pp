import {
  Body,
  Controller,
  Delete,
  Get,
  HttpStatus,
  Param,
  ParseIntPipe,
  Put,
  Req,
  UseGuards,
} from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { IsAdminGuard } from 'src/auth/isAdmin.guard';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { ValidationPipe } from 'src/pipes/validation.pipe';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './users.model';
import { UsersService } from './users.service';

@ApiTags('Users')
@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  // @ApiOperation({ summary: 'User creation' })
  // @ApiResponse({ status: HttpStatus.CREATED, type: User })
  // @Post()
  // createUser(@Body(new ValidationPipe()) userDto: CreateUserDto) {
  //   return this.usersService.createUser(userDto);
  // }

  @ApiOperation({ summary: 'Get all users. Admin only' })
  @ApiResponse({ status: HttpStatus.OK, type: [User] })
  @UseGuards(IsAdminGuard)
  @Get()
  getAllUsers() {
    return this.usersService.getAllUsers();
  }

  @ApiOperation({ summary: 'Get user by id. Admin only' })
  @ApiResponse({ status: HttpStatus.OK, type: User })
  @UseGuards(IsAdminGuard)
  @Get('/id/:id')
  getUserById(
    @Param(
      'id',
      new ParseIntPipe({ errorHttpStatusCode: HttpStatus.NOT_ACCEPTABLE }),
    )
    id: number,
  ) {
    return this.usersService.getUserById(id);
  }

  @ApiOperation({ summary: 'Get user by email. Admin only' })
  @ApiResponse({ status: HttpStatus.OK, type: User })
  @UseGuards(IsAdminGuard)
  @Get('/email/:email')
  getUserByEmail(@Param('email') email: string) {
    return this.usersService.getUserByEmail(email);
  }

  @ApiOperation({ summary: 'Update user' })
  @ApiResponse({ status: HttpStatus.OK, type: User })
  @UseGuards(JwtAuthGuard)
  @Put()
  updateUser(
    @Body(new ValidationPipe()) updateUserDto: UpdateUserDto,
    @Req() req,
  ) {
    return this.usersService.updateUser(updateUserDto, req.user.sub);
  }

  @ApiOperation({ summary: 'Delete currently loged in user' })
  @ApiResponse({ status: HttpStatus.OK })
  @UseGuards(JwtAuthGuard)
  @Delete('/me')
  deleteMe(@Req() req) {
    return this.usersService.deleteMe(req.user.sub);
  }
}
