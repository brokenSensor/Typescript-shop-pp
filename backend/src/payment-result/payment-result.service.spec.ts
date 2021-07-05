import { Test, TestingModule } from '@nestjs/testing';
import { PaymentResultService } from './payment-result.service';

describe('PaymentResultService', () => {
  let service: PaymentResultService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PaymentResultService],
    }).compile();

    service = module.get<PaymentResultService>(PaymentResultService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
