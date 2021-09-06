import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PaginatedCategories } from 'src/types';
import { User } from 'src/users/users.model';
import { Repository } from 'typeorm';
import { Category } from './category.model';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';

@Injectable()
export class CategoryService {
  constructor(
    @InjectRepository(Category)
    private categoryRepository: Repository<Category>,
    @InjectRepository(User) private userRepository: Repository<User>,
  ) {}

  async addNewCategory(dto: CreateCategoryDto): Promise<void> {
    const user = await this.userRepository.findOne({
      where: { id: dto.userId },
    });

    const newCategory = new Category();

    newCategory.name = dto.name;
    newCategory.user = user;

    await this.categoryRepository.save(newCategory);
  }

  async getAllCategories(): Promise<Category[]> {
    return await this.categoryRepository.find({
      order: { name: 'ASC' },
    });
  }

  async getAllCategoriesForAdmin(
    pageNumber,
    keyword,
  ): Promise<PaginatedCategories> {
    const pageSize = 12;
    const page =
      pageNumber === 'undefined' || pageNumber === '' ? 1 : pageNumber;
    keyword = keyword === 'undefined' ? '' : keyword;

    const [categories, count] = await this.categoryRepository
      .createQueryBuilder('category')
      .leftJoinAndSelect('category.user', 'user')
      .where('LOWER(category.name) LIKE :name', {
        name: `%${keyword.toLowerCase()}%`,
      })
      .take(pageSize)
      .skip(pageSize * (page - 1))
      .orderBy('category.id', 'ASC')
      .getManyAndCount();

    return { page, pages: Math.ceil(count / pageSize), categories };
  }

  async getCategoryById(id: number): Promise<Category> {
    return this.categoryRepository.findOne({ where: { id } });
  }

  async deleteCategory(id: number): Promise<void> {
    this.categoryRepository.delete(id);
  }

  async updateCategory(dto: UpdateCategoryDto): Promise<void> {
    const category = await this.categoryRepository.findOne({
      where: { id: dto.id },
    });

    if (!category) {
      throw new HttpException(
        {
          statusCode: HttpStatus.NOT_FOUND,
          message: ['Category not found.'],
          error: 'Not Found',
        },
        HttpStatus.NOT_FOUND,
      );
    } else {
      category.name = dto.name;
      await this.categoryRepository.save(category);
    }
  }
}
