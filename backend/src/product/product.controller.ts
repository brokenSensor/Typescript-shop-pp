import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseIntPipe,
  Post,
  Put,
  Query,
  Req,
  UploadedFile,
  UseGuards,
  UseInterceptors,
  ValidationPipe,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { diskStorage } from 'multer';
import { IsAdminGuard } from 'src/auth/guards/isAdmin.guard';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { Product } from './product.model';
import { ProductService } from './product.service';
import * as path from 'path';
import { v4 } from 'uuid';
import { validMimeTypes } from 'src/types';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';

@ApiTags('Product')
@Controller('api/product')
export class ProductController {
  constructor(private productService: ProductService) {}

  @ApiOperation({ summary: 'Create new product. Admin only' })
  @ApiResponse({ status: HttpStatus.CREATED })
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
  @Post('/upload')
  @UseInterceptors(
    FileInterceptor('image', {
      storage: diskStorage({
        destination: './client/images',
        filename: (req, file, cd) => {
          const fileExtension: string = path.extname(file.originalname);
          const fileName: string = v4() + fileExtension;
          cd(null, fileName);
        },
      }),
      fileFilter: (req, file, cb) => {
        const allowedMimeTypes = validMimeTypes;
        allowedMimeTypes.includes(file.mimetype)
          ? cb(null, true)
          : cb(null, false);
      },
    }),
  )
  upload(@UploadedFile() file: Express.Multer.File) {
    return this.productService.upload(file);
  }

  @ApiOperation({ summary: 'Get all products' })
  @ApiResponse({ status: HttpStatus.OK, type: [Product] })
  @Get()
  getAllProducts(
    @Query('pageNumber') pageNumber: number,
    @Query('keyword') keyword: string,
    @Query('category') category: string,
  ) {
    return this.productService.getAllProducts(pageNumber, keyword, category);
  }

  @ApiOperation({ summary: 'Get top 5 products' })
  @ApiResponse({ status: HttpStatus.OK, type: [Product] })
  @Get('/top5')
  getTopProducts() {
    return this.productService.getTopProducts();
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
  @ApiResponse({ status: HttpStatus.OK })
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
