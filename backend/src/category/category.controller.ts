import {
  Body,
  Controller,
  Get,
  HttpStatus,
  Post,
  UseGuards,
  ValidationPipe,
} from '@nestjs/common';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { IsAdminGuard } from 'src/auth/guards/isAdmin.guard';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { CategoryService } from './category.service';
import { CreateCategoryDto } from './dto/create-category.dto';

@Controller('category')
export class CategoryController {
  constructor(private categoryService: CategoryService) {}

  @ApiOperation({ summary: 'Get all categories' })
  @ApiResponse({
    status: HttpStatus.OK,
  })
  @Post()
  @UseGuards(JwtAuthGuard, IsAdminGuard)
  async addNewCategory(@Body(new ValidationPipe()) dto: CreateCategoryDto) {
    return await this.categoryService.addNewCategory(dto);
  }

  @ApiOperation({ summary: 'Get all categories' })
  @ApiResponse({
    status: HttpStatus.OK,
  })
  @Get()
  async getAllCategories() {
    return await this.categoryService.getAllCategories();
  }
}
