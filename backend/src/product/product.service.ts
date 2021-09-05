import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Category } from 'src/category/category.model';
import { Review } from 'src/review/review.model';
import { PaginatedProduct, PaginatedProducts } from 'src/types';
import { User } from 'src/users/users.model';
import { UsersService } from 'src/users/users.service';
import { Repository } from 'typeorm';
import { products, users } from './dbseed';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { Product } from './product.model';

@Injectable()
export class ProductService {
  constructor(
    @InjectRepository(Product) private productRepository: Repository<Product>,
    @InjectRepository(User) private userRepository: Repository<User>,
    @InjectRepository(Review) private reviewRepository: Repository<Review>,
    @InjectRepository(Category)
    private categoryRepository: Repository<Category>,
    private usersService: UsersService,
  ) {}
  async createProduct(dto: CreateProductDto, userId: number): Promise<void> {
    const user = await this.userRepository.findOne(userId);
    const newProduct = this.productRepository.create({ ...dto, user });

    await this.productRepository.save(newProduct);
  }

  async getAllProducts(
    pageNumber: number | 'undefined' | '',
    keyword: string,
    category: string,
  ): Promise<PaginatedProducts> {
    const pageSize = 12;
    const page =
      pageNumber === 'undefined' || pageNumber === '' ? 1 : pageNumber;
    keyword = keyword === 'undefined' ? '' : keyword;
    category = category === 'undefined' ? '' : category;

    const [products, count] = await this.productRepository
      .createQueryBuilder('product')
      .leftJoinAndSelect('product.category', 'category')
      .where('LOWER(product.name) LIKE :name', {
        name: `%${keyword.toLowerCase()}%`,
      })
      .andWhere('LOWER(category.name) LIKE :category', {
        category: `%${category.toLowerCase()}%`,
      })
      .take(pageSize)
      .skip(pageSize * (page - 1))
      .orderBy('product.id')
      .getManyAndCount();

    return { page, pages: Math.ceil(count / pageSize), products };
  }

  async getProductById(
    id: number,
    reviewPageNumber: number | 'undefined' | '',
  ): Promise<PaginatedProduct> {
    const pageSize = 4;
    const page =
      reviewPageNumber === 'undefined' || reviewPageNumber === ''
        ? 1
        : reviewPageNumber;
    const product = await this.productRepository.findOne({
      where: { id },
      relations: ['category'],
    });
    const [reviews, count] = await this.reviewRepository
      .createQueryBuilder('review')
      .where('review.productId = :productId', { productId: id })
      .take(pageSize)
      .skip(pageSize * (page - 1))
      .orderBy('review.createdAt')
      .getManyAndCount();

    product.reviews = reviews;
    return { page, pages: Math.ceil(count / pageSize), product };
  }

  async updateProduct(dto: UpdateProductDto): Promise<void> {
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
      await this.productRepository.save(product);
    }
  }

  async deleteProduct(id: number): Promise<void> {
    await this.productRepository.delete(id);
  }

  async updateProductReviewsSum(productId: number): Promise<void> {
    const product = await this.productRepository.findOne(productId, {
      relations: ['reviews'],
    });

    product.numReviews = product.reviews.length;
    const sumRating = product.reviews.reduce(
      (rating, review) => (rating = rating + review.rating),
      0,
    );
    product.rating = parseFloat((sumRating / product.numReviews).toFixed(1));
    await this.productRepository.save(product);
  }

  async seed(): Promise<void> {
    users.forEach(async (user) => {
      await this.usersService.createUser({ ...user, strategy: 'local' });
    });

    const notAdmin = await this.userRepository.findOne({
      email: 'bobAdmin@mail.com',
    });

    notAdmin.isAdmin = true;

    await this.userRepository.save(notAdmin);

    const admin = await this.usersService.getUserByEmail('bobAdmin@mail.com');

    async function asyncForEach(array, callback) {
      for (let index = 0; index < array.length; index++) {
        await callback(array[index], index, array);
      }
    }

    asyncForEach(products, async (product) => {
      let category = await this.categoryRepository.findOne({
        where: { name: product.category },
      });

      if (!category) {
        category = new Category();
        category.name = product.category;
        category.user = admin;

        category = await this.categoryRepository.save(category);
      }
      await this.createProduct({ ...product, category: category }, admin.id);
    });
  }

  async getTopProducts(): Promise<Product[]> {
    return await this.productRepository.find({
      order: { rating: 'DESC' },
      take: 5,
    });
  }

  async upload(file: Express.Multer.File): Promise<{ filePath: string }> {
    if (file) {
      const fullPath = `${file.destination}/${file.filename}`;
      const filePath = fullPath.split('./client')[1];
      return { filePath };
    }
  }
}
