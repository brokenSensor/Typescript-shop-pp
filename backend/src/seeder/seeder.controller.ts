import { Controller, Delete, Get } from '@nestjs/common';
import { SeederService } from './seeder.service';

@Controller('seeder')
export class SeederController {
  constructor(private seederService: SeederService) {}
  @Get()
  seed() {
    this.seederService.seed();
  }
  @Delete()
  clearDB() {
    this.seederService.clearDB();
  }
}
