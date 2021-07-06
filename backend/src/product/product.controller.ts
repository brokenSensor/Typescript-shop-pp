import {
  Body,
  Controller,
  Delete,
  Get,
  HttpStatus,
  Param,
  ParseIntPipe,
  Post,
  Put,
  Req,
  UseGuards,
  ValidationPipe,
} from '@nestjs/common';
import { IsAdminGuard } from 'src/auth/isAdmin.guard';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { ProductService } from './product.service';

@Controller('product')
export class ProductController {
  constructor(private productService: ProductService) {}

  @UseGuards(IsAdminGuard)
  @Post()
  async createProduct(
    @Body(new ValidationPipe()) productDto: CreateProductDto,
    @Req() req,
  ) {
    return this.productService.createProduct({
      ...productDto,
      user: req.user.sub,
    });
  }

  @Get()
  getAllProducts() {
    return this.productService.getAllProducts();
  }

  @Get('/:id')
  getProductById(
    @Param(
      'id',
      new ParseIntPipe({ errorHttpStatusCode: HttpStatus.NOT_ACCEPTABLE }),
    )
    id: number,
  ) {
    return this.productService.getProductById(id);
  }

  @UseGuards(IsAdminGuard)
  @Put()
  updateProduct(@Body() updateProductDto: UpdateProductDto) {
    return this.productService.updateProduct(updateProductDto);
  }

  @UseGuards(IsAdminGuard)
  @Delete('/:id')
  deleteProduct(
    @Param(
      'id',
      new ParseIntPipe({ errorHttpStatusCode: HttpStatus.NOT_ACCEPTABLE }),
    )
    id: number,
  ) {
    return 'True';
  }
}
