import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Request } from 'express';
import { User } from 'src/users/users.model';
import { UsersService } from 'src/users/users.service';
import { Like, Repository } from 'typeorm';
import { Query } from 'typeorm/driver/Query';
import { products, users } from './dbseed';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { Product } from './product.model';

export type PaginatedProducts = {
  pages: number;
  page: number;
  products: Product[];
};

@Injectable()
export class ProductService {
  constructor(
    @InjectRepository(Product) private productRepository: Repository<Product>,
    @InjectRepository(User) private userRepository: Repository<User>,
    private usersService: UsersService,
  ) {}
  async createProduct(dto: CreateProductDto, userId: number): Promise<Product> {
    const user = await this.userRepository.findOne(userId);
    const newProduct = this.productRepository.create({ ...dto, user });

    return await this.productRepository.save(newProduct);
  }

  async getAllProducts(pageNumber, keyword): Promise<PaginatedProducts> {
    const pageSize = 12;
    const page = pageNumber === 'undefined' ? 1 : pageNumber;
    keyword = keyword === 'undefined' ? '' : keyword;

    const [products, count] = await this.productRepository
      .createQueryBuilder()
      .where('LOWER(name) LIKE :name', {
        name: `%${keyword.toLowerCase()}%`,
      })
      .take(pageSize)
      .skip(pageSize * (page - 1))
      .getManyAndCount();

    // const [products, count] = await this.productRepository.findAndCount({
    //   where: { name: Like('%' + keyword + '%') },
    //   take: pageSize,
    //   skip: pageSize * (page - 1),
    // });

    return { page, pages: Math.ceil(count / pageSize), products };
  }

  async getProductById(id: number): Promise<Product> {
    return await this.productRepository.findOne(id, {
      relations: ['reviews'],
    });
  }

  async updateProduct(dto: UpdateProductDto): Promise<Product> {
    const product = await this.productRepository.findOne({
      where: { id: dto.id },
    });

    if (!product) {
      throw new HttpException(
        {
          statusCode: HttpStatus.NOT_FOUND,
          message: ['Product not found.'],
          error: 'Not Found',
        },
        HttpStatus.NOT_FOUND,
      );
    } else {
      if (dto.name) product.name = dto.name;
      if (dto.brand) product.brand = dto.brand;
      if (dto.category) product.category = dto.category;
      if (dto.countInStock) product.countInStock = dto.countInStock;
      if (dto.description) product.description = dto.description;
      if (dto.image) product.image = dto.image;
      if (dto.price) product.price = dto.price;
      this.productRepository.save(product);
      return this.getProductById(dto.id);
    }
  }

  async deleteProduct(id: number): Promise<{ message: string }> {
    const product = await this.productRepository.findOne(id);

    if (!product || !id) {
      throw new HttpException(
        {
          statusCode: HttpStatus.NOT_FOUND,
          message: ['Product not found.'],
          error: 'Not Found',
        },
        HttpStatus.NOT_FOUND,
      );
    } else {
      this.productRepository.delete(id);
      return { message: 'Product deleted' };
    }
  }

  async updateProductReviewsSum(productId): Promise<Product> {
    const product = await this.productRepository.findOne(productId, {
      relations: ['reviews'],
    });

    product.numReviews = product.reviews.length;
    const sumRating = product.reviews.reduce(
      (rating, review) => (rating = rating + review.rating),
      0,
    );
    product.rating = parseFloat((sumRating / product.numReviews).toFixed(1));
    return await this.productRepository.save(product);
  }

  async seed(): Promise<void> {
    users.forEach(async (user) => {
      await this.usersService.createUser({ ...user });
    });

    const notAdmin = await this.userRepository.findOne({
      email: 'bobAdmin@mail.com',
    });

    notAdmin.isAdmin = true;

    await this.userRepository.save(notAdmin);

    const admin = await this.usersService.getUserByEmail('bobAdmin@mail.com');

    products.forEach(async (product) => {
      await this.createProduct({ ...product }, admin.id);
    });
  }

  async getTopProducts(): Promise<Product[]> {
    return await this.productRepository.find({
      order: { rating: 'DESC' },
      take: 5,
    });
  }

  async upload(file: Express.Multer.File): Promise<{ filePath: string }> {
    const fullPath = `${file.destination}/${file.filename}`;
    const filePath = fullPath.split('./client')[1];
    return { filePath };
  }
}
