import { ApiProperty } from '@nestjs/swagger';

export class UpdateUserDto {
  @ApiProperty({ example: '1', description: 'Unique identifier' })
  readonly id: number;
  @ApiProperty({ example: 'Bob', description: 'User name' })
  readonly name?: string;
  @ApiProperty({ example: 'example@mail.com', description: 'Unique email' })
  readonly email?: string;
  @ApiProperty({ example: '12345678', description: 'User password' })
  readonly password?: string;
  @ApiProperty({
    example: 'false',
    description: 'Is this user an administrator',
  })
  readonly isAdmin?: boolean;
}
