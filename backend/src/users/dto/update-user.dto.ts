import { ApiProperty } from '@nestjs/swagger';

export class UpdateUserDto {
  @ApiProperty({ example: 'Bob', description: 'User name' })
  readonly name?: string;
  @ApiProperty({ example: 'example@mail.com', description: 'Unique email' })
  readonly email?: string;
  @ApiProperty({ example: '12345678', description: 'User password' })
  readonly password?: string;
}
