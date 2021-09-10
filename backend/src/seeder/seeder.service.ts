import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import * as fs from 'fs';
import * as path from 'path';
import { Category } from 'src/category/category.model';
import { Order } from 'src/order/order.model';
import { Product } from 'src/product/product.model';
import { ProductService } from 'src/product/product.service';
import { Review } from 'src/review/review.model';
import { ReviewService } from 'src/review/review.service';
import { User } from 'src/users/users.model';
import { UsersService } from 'src/users/users.service';
import { Repository } from 'typeorm';
import { users, products } from './dbseed';

async function asyncForEach(array, callback) {
  for (let index = 0; index < array.length; index++) {
    await callback(array[index], index, array);
  }
}

@Injectable()
export class SeederService {
  constructor(
    @InjectRepository(Product) private productRepository: Repository<Product>,
    @InjectRepository(User) private userRepository: Repository<User>,
    @InjectRepository(Review) private reviewRepository: Repository<Review>,
    @InjectRepository(Category)
    private categoryRepository: Repository<Category>,
    @InjectRepository(Order)
    private orderRepository: Repository<Order>,
    private usersService: UsersService,
    private reviewService: ReviewService,
    private productService: ProductService,
  ) {}

  async seed(): Promise<void> {
    await this.clearDB();
    await this.clearImages();
    await this.seedUsers();
    await this.seedAdmin();
    await this.seedProductsAndCategories();
    await this.seedReviews();
  }

  async clearDB() {
    const reviews = await this.reviewRepository.find();
    if (reviews.length > 0)
      await this.reviewRepository.delete(reviews.map((review) => review.id));

    const products = await this.productRepository.find();
    if (products.length > 0)
      await this.productRepository.delete(
        products.map((product) => product.id),
      );

    const orders = await this.orderRepository.find();
    if (orders.length > 0)
      await this.orderRepository.delete(orders.map((order) => order.id));

    const categories = await this.categoryRepository.find();
    if (categories.length > 0)
      await this.categoryRepository.delete(
        categories.map((category) => category.id),
      );

    const users = await this.userRepository.find();
    if (users.length > 0)
      await this.userRepository.delete(users.map((user) => user.id));
  }

  async clearImages() {
    const defaulImages = [
      'acer.jpg',
      'amd.jpg',
      'amdg.jpg',
      'asus.jpg',
      'favicon.ico',
      'honor.jpg',
      'huav.jpg',
      'intel.jpg',
      'iphone12.jpg',
      'mac.jpg',
      'nintendo.jpg',
      'ps5.jpg',
      'ss21.jpg',
      'xbox.jpg',
      'xiomi.jpg',
      '.DS_Store',
    ];
    const pathToImages = path.join(__dirname, '..', '..', 'client', 'images');

    fs.readdir(pathToImages, (err, files) => {
      files.forEach((file) => {
        if (!defaulImages.includes(file)) {
          fs.unlinkSync(path.join(pathToImages, file));
        }
      });
    });
  }

  async seedUsers() {
    asyncForEach(users, async (user) => {
      await this.usersService.createUser({
        ...user,
        strategy: 'local',
      });
    });
  }

  async seedAdmin() {
    try {
      const user = await this.userRepository.findOne({
        where: { email: 'admin@admin.new' },
      });
      user.isAdmin = true;
      await this.userRepository.save(user);
    } catch (error) {
      await this.seedAdmin();
    }
  }

  async seedProductsAndCategories() {
    const admin = await this.userRepository.findOne({
      where: { email: 'admin@admin.new' },
    });

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
      await this.productService.createProduct(
        { ...product, category: category },
        admin.id,
      );
    });
  }

  async seedReviews() {
    enum RatingComment {
      "Very bad product. Won't Recommend",
      'Bad product. Better not to buy',
      'Meh product. Nothing special',
      'Good product. I recommend it',
      'Excellent product! One of the best!',
    }

    const [allUsers, userCount] = await this.userRepository.findAndCount();
    const [allProducts, productCount] =
      await this.productRepository.findAndCount();

    if (userCount === users.length && productCount === products.length) {
      const randomRating = () => {
        return Math.floor(Math.random() * 5) + 1;
      };
      allProducts.forEach(async (product) => {
        allUsers.forEach(async (user) => {
          const usersRating = randomRating();
          this.reviewService.createReview(
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
    } else {
      this.seedReviews();
    }
  }
}
