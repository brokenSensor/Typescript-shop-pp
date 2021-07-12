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
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { IsAdminGuard } from 'src/auth/isAdmin.guard';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { Product } from './product.model';
import { ProductService } from './product.service';

@ApiTags('Product')
@Controller('product')
export class ProductController {
  constructor(private productService: ProductService) {}

  @Get('/seedproducts')
  seed() {
    this.productService.seed();
  }

  @ApiOperation({ summary: 'Create new product. Admin only' })
  @ApiResponse({ status: HttpStatus.CREATED, type: Product })
  @UseGuards(IsAdminGuard)
  @Post()
  async createProduct(
    @Body(new ValidationPipe()) productDto: CreateProductDto,
    @Req() req,
  ) {
    return this.productService.createProduct(productDto, req.user.sub);
  }

  @ApiOperation({ summary: 'Get all products' })
  @ApiResponse({ status: HttpStatus.OK, type: [Product] })
  @Get()
  getAllProducts() {
    return this.productService.getAllProducts();
  }

  @ApiOperation({ summary: 'Get product by id' })
  @ApiResponse({ status: HttpStatus.OK, type: Product })
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

  @ApiOperation({ summary: 'Update product by id. Admin only' })
  @ApiResponse({ status: HttpStatus.OK, type: Product })
  @UseGuards(IsAdminGuard)
  @Put('/:productId')
  updateProduct(
    @Body() updateProductDto: UpdateProductDto,
    @Param(
      'productId',
      new ParseIntPipe({ errorHttpStatusCode: HttpStatus.NOT_ACCEPTABLE }),
    )
    productId: number,
  ) {
    return this.productService.updateProduct(updateProductDto, productId);
  }

  @ApiOperation({ summary: 'Delete product by id. Admin only' })
  @ApiResponse({
    status: HttpStatus.OK,
  })
  @UseGuards(IsAdminGuard)
  @Delete('/:id')
  deleteProduct(
    @Param(
      'id',
      new ParseIntPipe({ errorHttpStatusCode: HttpStatus.NOT_ACCEPTABLE }),
    )
    id: number,
  ) {
    return this.productService.deleteProduct(id);
  }
}
