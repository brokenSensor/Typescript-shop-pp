import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { Product } from './product.model';

@Injectable()
export class ProductService {
  constructor(
    @InjectRepository(Product) private productRepository: Repository<Product>,
  ) {}
  async createProduct(dto: CreateProductDto): Promise<Product> {
    const newProduct = this.productRepository.create(dto);

    return await this.productRepository.save(newProduct);
  }

  async getAllProducts(): Promise<Product[]> {
    return await this.productRepository.find({ relations: ['reviews'] });
  }

  async getProductById(id): Promise<Product> {
    return await this.productRepository.findOne(id, {
      relations: ['reviews'],
    });
  }

  async updateProduct(dto: UpdateProductDto): Promise<Product> {
    const product = await this.productRepository.findOne(dto.id);

    if (!product || !dto.id) {
      throw new HttpException(
        {
          statusCode: HttpStatus.NOT_FOUND,
          message: ['Product not found.'],
          error: 'Not Found',
        },
        HttpStatus.NOT_FOUND,
      );
    } else {
      this.productRepository.update(dto.id, dto);
      return this.getProductById(dto.id);
    }
  }
}
