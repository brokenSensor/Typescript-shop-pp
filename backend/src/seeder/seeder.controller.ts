import { Controller, Delete, Get } from '@nestjs/common';
import { SeederService } from './seeder.service';

@Controller('api/seeder')
export class SeederController {
  constructor(private seederService: SeederService) {}
  @Get()
  seed() {
    this.seederService.seed();
  }
  @Delete()
  clearDB() {
    this.seederService.clearImages();
  }
}
