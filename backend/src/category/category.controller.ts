import {
  Body,
  Controller,
  Delete,
  Get,
  HttpStatus,
  Param,
  ParseIntPipe,
  Post,
  Put,
  Query,
  UseGuards,
  ValidationPipe,
} from '@nestjs/common';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { IsAdminGuard } from 'src/auth/guards/isAdmin.guard';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { Category } from './category.model';
import { CategoryService } from './category.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';

@Controller('api/category')
export class CategoryController {
  constructor(private categoryService: CategoryService) {}

  @ApiOperation({ summary: 'Add new category' })
  @ApiResponse({
    status: HttpStatus.CREATED,
  })
  @UseGuards(JwtAuthGuard, IsAdminGuard)
  @Post()
  async addNewCategory(@Body(new ValidationPipe()) dto: CreateCategoryDto) {
    return await this.categoryService.addNewCategory(dto);
  }

  @ApiOperation({ summary: 'Delete category' })
  @ApiResponse({
    status: HttpStatus.OK,
  })
  @UseGuards(JwtAuthGuard, IsAdminGuard)
  @Delete('/:id')
  async deleteCategory(@Param('id') id: number) {
    return await this.categoryService.deleteCategory(id);
  }

  @ApiOperation({ summary: 'Get all categories' })
  @ApiResponse({
    status: HttpStatus.OK,
  })
  @Get()
  async getAllCategories() {
    return await this.categoryService.getAllCategories();
  }

  @ApiOperation({ summary: 'Get all categories with user' })
  @ApiResponse({
    status: HttpStatus.OK,
  })
  @UseGuards(JwtAuthGuard, IsAdminGuard)
  @Get('/admin')
  async getAllCategoriesForAdmin(
    @Query('pageNumber') pageNumber: number,
    @Query('keyword') keyword: string,
  ) {
    return await this.categoryService.getAllCategoriesForAdmin(
      pageNumber,
      keyword,
    );
  }

  @ApiOperation({ summary: 'Get category by id' })
  @ApiResponse({ status: HttpStatus.OK, type: Category })
  @Get('/:id')
  getCategoryById(
    @Param(
      'id',
      new ParseIntPipe({ errorHttpStatusCode: HttpStatus.NOT_ACCEPTABLE }),
    )
    id: number,
  ) {
    return this.categoryService.getCategoryById(id);
  }

  @ApiOperation({ summary: 'Update category by id. Admin only' })
  @ApiResponse({ status: HttpStatus.OK })
  @UseGuards(JwtAuthGuard, IsAdminGuard)
  @Put()
  updateCategory(@Body() updateCategoryDto: UpdateCategoryDto) {
    return this.categoryService.updateCategory(updateCategoryDto);
  }
}
