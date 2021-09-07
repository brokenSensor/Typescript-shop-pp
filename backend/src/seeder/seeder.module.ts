import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Category } from 'src/category/category.model';
import { Order } from 'src/order/order.model';
import { Product } from 'src/product/product.model';
import { ProductModule } from 'src/product/product.module';
import { Review } from 'src/review/review.model';
import { ReviewModule } from 'src/review/review.module';
import { User } from 'src/users/users.model';
import { UsersModule } from 'src/users/users.module';
import { SeederController } from './seeder.controller';
import { SeederService } from './seeder.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Product, User, Review, Category, Order]),
    UsersModule,
    ReviewModule,
    ProductModule,
  ],
  controllers: [SeederController],
  providers: [SeederService],
})
export class SeederModule {}
