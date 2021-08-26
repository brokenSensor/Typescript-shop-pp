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
  UploadedFile,
  UseGuards,
  UseInterceptors,
  ValidationPipe,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { IsAdminGuard } from 'src/auth/isAdmin.guard';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { Product } from './product.model';
import { ProductService } from './product.service';

@ApiTags('Product')
@Controller('product')
export class ProductController {
  constructor(private productService: ProductService) {}

  @ApiOperation({ summary: 'Create new product. Admin only' })
  @ApiResponse({ status: HttpStatus.CREATED, type: Product })
  @UseGuards(JwtAuthGuard, IsAdminGuard)
  @Post()
  async createProduct(
    @Body(new ValidationPipe()) productDto: CreateProductDto,
    @Req() req,
  ) {
    return this.productService.createProduct(productDto, req.user.id);
  }

  @ApiOperation({ summary: 'Upload product image' })
  @ApiResponse({ status: HttpStatus.CREATED })
  // @UseGuards(JwtAuthGuard, IsAdminGuard)
  @Post('/upload')
  @UseInterceptors(
    FileInterceptor('image', {
      dest: './client/images',
    }),
  )
  upload(@UploadedFile() file: Express.Multer.File) {
    return this.productService.upload(file);
  }

  @ApiOperation({ summary: 'Get all products' })
  @ApiResponse({ status: HttpStatus.OK, type: [Product] })
  @Get()
  getAllProducts() {
    return this.productService.getAllProducts();
  }

  @ApiOperation({ summary: 'Get top 5 products' })
  @ApiResponse({ status: HttpStatus.OK, type: [Product] })
  @Get('/top5')
  getTopProducts() {
    return this.productService.getTopProducts();
  }

  @Get('/seedproducts')
  seed() {
    this.productService.seed();
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
  @UseGuards(JwtAuthGuard, IsAdminGuard)
  @Put()
  updateProduct(@Body() updateProductDto: UpdateProductDto) {
    return this.productService.updateProduct(updateProductDto);
  }

  @ApiOperation({ summary: 'Delete product by id. Admin only' })
  @ApiResponse({
    status: HttpStatus.OK,
  })
  @UseGuards(JwtAuthGuard, IsAdminGuard)
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
