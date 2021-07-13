import { ApiProperty } from '@nestjs/swagger';
import {
  IsDefined,
  IsEmail,
  IsNotEmpty,
  IsString,
  Length,
} from 'class-validator';

export class CreateUserDto {
  @ApiProperty({ example: 'Bob', description: 'User name' })
  @IsDefined()
  @IsNotEmpty({ message: 'Name must not be empty.' })
  @IsString({ message: 'Name must be a string.' })
  name: string;

  @ApiProperty({ example: 'example@mail.com', description: 'Unique email' })
  @IsDefined()
  @IsEmail({}, { message: 'Email is not valid.' })
  email: string;

  @ApiProperty({ example: '12345678', description: 'User password' })
  @IsDefined()
  @Length(6, 16, {
    message: 'The password must be between 6 and 16 characters long.',
  })
  password: string;
}
