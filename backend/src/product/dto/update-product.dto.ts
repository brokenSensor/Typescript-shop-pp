import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsInt } from 'class-validator';
import { Category } from 'src/category/category.model';

export class UpdateProductDto {
  @ApiProperty({ example: '1', description: 'Id of product' })
  @IsString()
  id: number;

  @ApiProperty({ example: 'Phone', description: 'Name of the product' })
  @IsString()
  name?: string;

  @ApiProperty({
    example: 'phone.jpg',
    description: 'Name of image of product',
  })
  @IsString()
  image?: string;

  @ApiProperty({ example: 'Best Phones', description: 'Brand of the product' })
  @IsString()
  brand?: string;

  @ApiProperty({
    example: 'Mobile phones',
    description: 'Category of the product',
  })
  category?: Category;

  @ApiProperty({ description: 'Description of the product' })
  @IsString()
  description?: string;

  @ApiProperty({
    example: '59',
    description: 'Price of the product',
  })
  @IsInt()
  price?: number;

  @ApiProperty({
    example: '5',
    description: 'Count in stock',
  })
  @IsInt()
  countInStock?: number;
}
