import { IsString, IsDefined } from 'class-validator';
import { User } from 'src/users/users.model';

export class CreateProductDto {
  user: User;

  @IsDefined({ message: 'Name is required.' })
  name: string;

  @IsDefined({ message: 'Image is required.' })
  image: string;

  @IsDefined({ message: 'Brand is required.' })
  brand: string;

  @IsDefined({ message: 'Category is required.' })
  category: string;

  @IsDefined({ message: 'Description is required.' })
  description: string;

  @IsDefined({ message: 'Price is required.' })
  price: number;

  @IsDefined({ message: 'Count is stock is required.' })
  countInStock: number;
}
