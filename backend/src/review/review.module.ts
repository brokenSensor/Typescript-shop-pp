import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Product } from 'src/product/product.model';
import { ProductModule } from 'src/product/product.module';
import { User } from 'src/users/users.model';
import { ReviewController } from './review.controller';
import { Review } from './review.model';
import { ReviewService } from './review.service';

@Module({
  imports: [TypeOrmModule.forFeature([User, Product, Review]), ProductModule],
  controllers: [ReviewController],
  providers: [ReviewService],
})
export class ReviewModule {}
