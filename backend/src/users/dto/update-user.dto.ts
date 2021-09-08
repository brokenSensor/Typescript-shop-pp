import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsEmail, IsString, Length } from 'class-validator';

export class UpdateUserDto {
  @ApiProperty({ example: '1', description: 'Unique identifier' })
  id?: number;

  @ApiProperty({ example: 'Bob', description: 'User name' })
  @IsString({ message: 'Name must be a string.' })
  name?: string;

  @ApiProperty({ example: 'example@mail.com', description: 'Unique email' })
  @IsEmail({}, { message: 'Email is not valid.' })
  email?: string;

  @ApiProperty({ example: '12345678', description: 'User password' })
  @Length(6, 16, {
    message: 'The password must be between 6 and 16 characters long.',
  })
  password?: string;

  @ApiProperty({
    example:
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJuYW1lIjoiQm9iaSBGb28iLCJlbWFpbCI6ImJvYnNhYUBtYWlsLmNvbSIsImlkIjoxNywiaXNBZG1pbiI6ZmFsc2UsImNyZWF0ZWRBdCI6IjIwMjEtMDctMTFUMDQ6NTM6NDQuMTIzWiIsInVwZGF0ZWRBdCI6IjIwMjEtMDctMTFUMDQ6NTM6NDQuMTIzWiIsImlhdCI6MTYyNTk3OTIyNCwiZXhwIjoxNjI1OTgxMDI0fQ.4u4X0anANiVdpyiCgClK6jLu4-qZv1SUPxLeDeM0HA8',
    description: 'Refresh token',
  })
  @IsString({ message: 'refresh_token must be a string.' })
  refresh_token?: string;

  @ApiProperty({
    example: 'false',
    description: 'Is this user an administrator',
  })
  @IsBoolean()
  isAdmin?: boolean;

  @ApiProperty({
    example: 'false',
    description: 'Is this user email is confirmed',
  })
  @IsBoolean()
  isActivated?: boolean;
}
