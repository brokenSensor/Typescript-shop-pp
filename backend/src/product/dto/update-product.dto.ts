import { IsString, IsInt } from 'class-validator';

export class UpdateProductDto {
  id: number;

  @IsString()
  name?: string;

  @IsString()
  image?: string;

  @IsString()
  brand?: string;

  @IsString()
  category?: string;

  @IsString()
  description?: string;

  @IsInt()
  price?: number;

  @IsInt()
  countInStock?: number;
}
