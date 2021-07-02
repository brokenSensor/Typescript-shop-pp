import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './users.model';
import { UsersService } from './users.service';

@ApiTags('Users')
@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @ApiOperation({ summary: 'User creation' })
  @ApiResponse({ status: 200, type: User })
  @Post()
  createUser(@Body() userDto: CreateUserDto) {
    return this.usersService.createUser(userDto);
  }

  @ApiOperation({ summary: 'Get all users' })
  @ApiResponse({ status: 200, type: [User] })
  @Get()
  getAllUsers() {
    return this.usersService.getAllUsers();
  }

  @ApiOperation({ summary: 'Get user by id' })
  @ApiResponse({ status: 200, type: User })
  @Get('/id/:id')
  getUserById(@Param('id') id: number) {
    return this.usersService.getUserById(id);
  }

  @ApiOperation({ summary: 'Get user by email' })
  @ApiResponse({ status: 200, type: User })
  @Get('/email/:email')
  getUserByEmail(@Param('email') email: string) {
    return this.usersService.getUserByEmail(email);
  }

  @ApiOperation({ summary: 'Update user' })
  @ApiResponse({ status: 200, type: User })
  @Put()
  updateUser(@Body() updateUserDto: UpdateUserDto) {
    return this.usersService.updateUser(updateUserDto);
  }

  @ApiOperation({ summary: 'Delete user' })
  @ApiResponse({ status: 200, type: User })
  @Delete('/:id')
  deleteUser(@Param('id') id: number) {
    return this.usersService.deleteUser(id);
  }
}
