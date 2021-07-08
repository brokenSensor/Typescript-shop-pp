import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Product } from 'src/product/product.model';
import { ProductService } from 'src/product/product.service';
import { User } from 'src/users/users.model';
import { Repository } from 'typeorm';
import { CreateReviewDto } from './dto/create-review.dto';
import { Review } from './review.model';

@Injectable()
export class ReviewService {
  constructor(
    @InjectRepository(Review) private reviewRepository: Repository<Review>,
    @InjectRepository(Product) private productRepository: Repository<Product>,
    @InjectRepository(User) private userRepository: Repository<User>,
    private productService: ProductService,
  ) {}

  async createReview(
    dto: CreateReviewDto,
    userId: number,
    productId: number,
  ): Promise<Product> {
    const user = await this.userRepository.findOne(userId);
    const review = await this.reviewRepository.findOne(
      { user },
      { relations: ['user'] },
    );
    if (review) {
      throw new HttpException(
        {
          statusCode: HttpStatus.FORBIDDEN,
          message: ['You have already left a review for this product.'],
          error: 'Forbidden',
        },
        HttpStatus.FORBIDDEN,
      );
    }

    const product = await this.productRepository.findOne(productId, {
      relations: ['reviews'],
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
    }

    const newReview = {
      rating: dto.rating,
      comment: dto.comment,
      name: dto.name,
      user: user,
      product: product,
    };

    await this.reviewRepository.save(this.reviewRepository.create(newReview));

    return await this.productService.updateProductReviewsSum(productId);
  }

  async deleteReview(
    productId: number,
    reviewId: number,
    userId: number,
  ): Promise<{ message: string }> {
    const review = await this.reviewRepository.findOne(reviewId, {
      relations: ['user', 'product'],
    });
    if (!review) {
      throw new HttpException(
        {
          statusCode: HttpStatus.NOT_FOUND,
          message: ['Review not found.'],
          error: 'Not Found',
        },
        HttpStatus.NOT_FOUND,
      );
    } else if (review.user.id !== userId) {
      throw new HttpException(
        {
          statusCode: HttpStatus.BAD_REQUEST,
          message: ['Review not made by user.'],
          error: 'Bad Request',
        },
        HttpStatus.BAD_REQUEST,
      );
    } else if (review.product.id !== productId) {
      throw new HttpException(
        {
          statusCode: HttpStatus.BAD_REQUEST,
          message: ['Product does not have this review.'],
          error: 'Bad Request',
        },
        HttpStatus.BAD_REQUEST,
      );
    }

    await this.reviewRepository.delete(reviewId);
    await this.productService.updateProductReviewsSum(productId);
    return { message: 'Review deleted' };
  }
}
