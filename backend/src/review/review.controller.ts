import {
  Body,
  Controller,
  Delete,
  HttpStatus,
  Param,
  ParseIntPipe,
  Post,
  Req,
  UseGuards,
  ValidationPipe,
} from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { CreateReviewDto } from './dto/create-review.dto';
import { ReviewService } from './review.service';

@Controller('review')
export class ReviewController {
  constructor(private reviewService: ReviewService) {}

  @UseGuards(JwtAuthGuard)
  @Post('/:productId')
  async createReview(
    @Body(new ValidationPipe()) reviewDto: CreateReviewDto,
    @Req() req,
    @Param(
      'productId',
      new ParseIntPipe({ errorHttpStatusCode: HttpStatus.NOT_ACCEPTABLE }),
    )
    productId: number,
  ) {
    return this.reviewService.createReview(reviewDto, req.user.sub, productId);
  }

  @UseGuards(JwtAuthGuard)
  @Delete('/:productId/:reviewId')
  async deleteReview(
    @Req() req,
    @Param(
      'productId',
      new ParseIntPipe({ errorHttpStatusCode: HttpStatus.NOT_ACCEPTABLE }),
    )
    productId: number,
    @Param(
      'reviewId',
      new ParseIntPipe({ errorHttpStatusCode: HttpStatus.NOT_ACCEPTABLE }),
    )
    reviewId: number,
  ) {
    return this.reviewService.deleteReview(productId, reviewId, req.user.sub);
  }
}
