import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateProductDto } from './dto/create-product.dto';
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
}
