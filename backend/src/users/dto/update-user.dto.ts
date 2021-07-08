import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, Length } from 'class-validator';

export class UpdateUserDto {
  @ApiProperty({ example: 'Bob', description: 'User name' })
  @IsString({ message: 'Name must be a string.' })
  name: string;
  @ApiProperty({ example: 'example@mail.com', description: 'Unique email' })
  @IsEmail({}, { message: 'Email is not valid.' })
  email: string;
  @ApiProperty({ example: '12345678', description: 'User password' })
  @Length(6, 16, {
    message: 'The password must be between 6 and 16 characters long.',
  })
  password?: string;
}
