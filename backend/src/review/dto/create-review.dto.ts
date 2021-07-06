import { IsString, IsDefined, IsInt } from 'class-validator';
import { Product } from 'src/product/product.model';
import { User } from 'src/users/users.model';

export class CreateReviewDto {
  user: User;

  product: Product;

  @IsDefined()
  @IsInt()
  rating: number;

  @IsDefined()
  @IsString()
  comment: string;

  @IsDefined()
  @IsString()
  name: string;
}
