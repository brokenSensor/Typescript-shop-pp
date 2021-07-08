import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsDefined, IsInt } from 'class-validator';

export class CreateReviewDto {
  @ApiProperty({ example: '3', description: 'Users rating of product' })
  @IsDefined()
  @IsInt()
  rating: number;

  @ApiProperty({
    example: 'Good product!',
    description: 'Users comment of product',
  })
  @IsDefined()
  @IsString()
  comment: string;

  @ApiProperty({ example: 'Bob', description: 'User name' })
  @IsDefined()
  @IsString()
  name: string;
}
