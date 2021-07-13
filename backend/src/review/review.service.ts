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
    if (!user) {
      throw new HttpException(
        {
          statusCode: HttpStatus.NOT_FOUND,
          message: ['User not found.'],
          error: 'Not Found',
        },
        HttpStatus.NOT_FOUND,
      );
    }
    const product = await this.productRepository.findOne(productId);
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

    const review = await this.reviewRepository.findOne(
      { user, product },
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

  async seedReviews() {
    enum RatingComment {
      "Very bad product. Won't Recommend",
      'Bad product. Better not to buy',
      'Meh product. Nothing special',
      'Good product. I recommend it',
      'Excellent product! One of the best!',
    }

    const allUsers = await this.userRepository.find();
    const allProducts = await this.productRepository.find();
    const randomRating = () => {
      return Math.floor(Math.random() * 5) + 1;
    };
    allProducts.forEach(async (product) => {
      allUsers.forEach(async (user) => {
        const usersRating = randomRating();
        this.createReview(
          {
            rating: usersRating,
            comment: RatingComment[usersRating - 1],
            name: user.name,
          },
          user.id,
          product.id,
        );
      });
    });
  }
}
