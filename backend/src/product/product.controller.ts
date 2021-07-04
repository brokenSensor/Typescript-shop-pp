import { Controller, Post, UseGuards } from '@nestjs/common';
import { IsAdminGuard } from 'src/auth/isAdmin.guard';
import { ProductService } from './product.service';

@Controller('product')
export class ProductController {
  constructor(private productService: ProductService) {}

  @UseGuards(IsAdminGuard)
  @Post()
  createProduct() {
    return 'True';
  }
}
