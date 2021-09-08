import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm';
import { User } from './users/users.model';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { ProductModule } from './product/product.module';
import { Product } from './product/product.model';
import { ReviewModule } from './review/review.module';
import { Review } from './review/review.model';
import { OrderModule } from './order/order.module';
import { Order } from './order/order.model';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { CategoryModule } from './category/category.module';
import { SeederModule } from './seeder/seeder.module';
import * as path from 'path';

const config: TypeOrmModuleOptions = {
  type: 'postgres',
  url: process.env.DATABASE_URL,
  // host: process.env.POSTGRES_HOST,
  // port: Number(process.env.POSTGRES_PORT),
  // username: process.env.POSTGRES_USER,
  // password: process.env.POSTGRES_PASSWORD,
  // database: process.env.POSTGRES_DB,
  entities: [User, Product, Review, Order],
  synchronize: true,
  autoLoadEntities: true,
  ssl: { rejectUnauthorized: false },
};
@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: `.${process.env.NODE_ENV}.env`,
    }),
    TypeOrmModule.forRoot(config),
    UsersModule,
    AuthModule,
    ConfigModule,
    ProductModule,
    ReviewModule,
    OrderModule,
    CategoryModule,
    SeederModule,
    ServeStaticModule.forRoot({
      rootPath: path.join(__dirname, '..', '..', 'frontend', 'build'),
      serveRoot: '/*',
      exclude: ['/auth*', '/order*', '/product*', '/review*', '/users*'],
    }),
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'client', 'images'),
      serveRoot: '/images',
      exclude: ['/auth*', '/order*', '/product*', '/review*', '/users*'],
    }),
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
