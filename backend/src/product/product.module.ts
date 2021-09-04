import { Module } from '@nestjs/common';
import { ProductService } from './product.service';
import { ProductController } from './product.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Product } from './product.model';
import { User } from 'src/users/users.model';
import { Review } from 'src/review/review.model';
import { AuthModule } from 'src/auth/auth.module';
import { UsersModule } from 'src/users/users.module';
import { Category } from 'src/category/category.model';

@Module({
  imports: [
    TypeOrmModule.forFeature([Product, User, Review, Category]),
    AuthModule,
    UsersModule,
  ],
  providers: [ProductService],
  controllers: [ProductController],
  exports: [ProductService],
})
export class ProductModule {}
