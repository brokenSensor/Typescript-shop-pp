import { ApiProperty } from '@nestjs/swagger';
import { IsDefined, IsNotEmpty, IsString } from 'class-validator';

export class CreateCategoryDto {
  @ApiProperty({ example: 'Bob', description: 'Category name' })
  @IsDefined()
  @IsNotEmpty({ message: 'Name must not be empty.' })
  @IsString({ message: 'Name must be a string.' })
  name: string;

  @ApiProperty({ example: '1', description: 'Unique id' })
  @IsDefined()
  userId: number;
}
