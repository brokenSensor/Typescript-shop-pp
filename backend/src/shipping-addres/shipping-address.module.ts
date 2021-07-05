import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ShippingAddress } from './shipping-address.model';
import { ShippingAddressService } from './shipping-address.service';

@Module({
  imports: [TypeOrmModule.forFeature([ShippingAddress])],
  providers: [ShippingAddressService],
})
export class ShippingAddressModule {}
