import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/users/users.model';
import { Repository } from 'typeorm';
import { Category } from './category.model';
import { CreateCategoryDto } from './dto/create-category.dto';

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
    return await this.categoryRepository.find();
  }
}
