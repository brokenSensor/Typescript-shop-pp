import {
  Body,
  Controller,
  Delete,
  Get,
  HttpStatus,
  Param,
  ParseIntPipe,
  Put,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { IsAdminGuard } from 'src/auth/isAdmin.guard';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { UserDTO } from 'types';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './users.model';
import { UsersService } from './users.service';

@ApiTags('Users')
@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @ApiOperation({ summary: 'Get all users. Admin only' })
  @ApiResponse({ status: HttpStatus.OK, type: [User] })
  @UseGuards(JwtAuthGuard, IsAdminGuard)
  @Get()
  getAllUsers(
    @Query('pageNumber') pageNumber: number,
    @Query('keyword') keyword: string,
  ) {
    return this.usersService.getAllUsers(pageNumber, keyword);
  }

  @ApiOperation({ summary: 'Get currently logged in user' })
  @ApiResponse({ status: HttpStatus.OK, type: UserDTO })
  @UseGuards(JwtAuthGuard)
  @Get('/me')
  getCurrentUser(@Req() req) {
    return this.usersService.getCurrentUser(req.user.id);
  }

  @ApiOperation({ summary: 'Get user by id. Admin only' })
  @ApiResponse({ status: HttpStatus.OK, type: User })
  @UseGuards(JwtAuthGuard, IsAdminGuard)
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
  @UseGuards(JwtAuthGuard, IsAdminGuard)
  @Get('/email/:email')
  getUserByEmail(@Param('email') email: string) {
    return this.usersService.getUserByEmail(email);
  }

  @ApiOperation({ summary: 'Update user' })
  @ApiResponse({ status: HttpStatus.OK })
  @UseGuards(JwtAuthGuard)
  @Put('/me')
  updateUser(@Body() updateUserDto: UpdateUserDto, @Req() req) {
    this.usersService.updateUser(updateUserDto, req.user.id, req.user.isAdmin);
  }

  @ApiOperation({ summary: 'Update user for admin' })
  @ApiResponse({ status: HttpStatus.OK })
  @UseGuards(JwtAuthGuard, IsAdminGuard)
  @Put('/admin')
  updateUserById(@Body() updateUserDto: UpdateUserDto, @Req() req) {
    this.usersService.updateUser(
      updateUserDto,
      updateUserDto.id,
      req.user.isAdmin,
    );
  }

  @ApiOperation({ summary: 'Delete currently logged in user' })
  @ApiResponse({ status: HttpStatus.OK })
  @UseGuards(JwtAuthGuard)
  @Delete('/me')
  deleteMe(@Req() req) {
    return this.usersService.deleteMe(req.user.id);
  }

  @ApiOperation({ summary: 'Delete user by id' })
  @ApiResponse({ status: HttpStatus.OK })
  @UseGuards(JwtAuthGuard, IsAdminGuard)
  @Delete('/:id')
  deleteUser(@Param('id') userId: number) {
    return this.usersService.deleteUser(userId);
  }
}
