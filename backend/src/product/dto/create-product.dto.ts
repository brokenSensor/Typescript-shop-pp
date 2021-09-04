import { ApiProperty } from '@nestjs/swagger';
import { IsDefined } from 'class-validator';
import { Category } from 'src/category/category.model';

export class CreateProductDto {
  @ApiProperty({ example: 'Phone', description: 'Name of the product' })
  @IsDefined({ message: 'Name is required.' })
  name: string;

  @ApiProperty({
    example: 'phone.jpg',
    description: 'Name of image of product',
  })
  @IsDefined({ message: 'Image is required.' })
  image: string;

  @ApiProperty({ example: 'Best Phones', description: 'Brand of the product' })
  @IsDefined({ message: 'Brand is required.' })
  brand: string;

  @ApiProperty({
    example: 'Mobile phones',
    description: 'Category of the product',
  })
  @IsDefined({ message: 'Category is required.' })
  category: Category;

  @ApiProperty({ description: 'Description of the product' })
  @IsDefined({ message: 'Description is required.' })
  description: string;

  @ApiProperty({
    example: '59',
    description: 'Price of the product',
  })
  @IsDefined({ message: 'Price is required.' })
  price: number;

  @ApiProperty({
    example: '5',
    description: 'Count in stock',
  })
  @IsDefined({ message: 'Count is stock is required.' })
  countInStock: number;
}
