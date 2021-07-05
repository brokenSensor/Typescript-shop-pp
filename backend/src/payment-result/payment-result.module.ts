import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PaymentResult } from './payment-result.model';
import { PaymentResultService } from './payment-result.service';

@Module({
  imports: [TypeOrmModule.forFeature([PaymentResult])],
  providers: [PaymentResultService],
})
export class PaymentResultModule {}
