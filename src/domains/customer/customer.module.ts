import { forwardRef, Module } from '@nestjs/common';
import { CustomerService } from './customer.service';
import { Customer } from './entities/customer.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Payment } from '../payment/entities/payment.entity';
import { Seller } from '../seller/entities/seller.entity';
import { CustomerController } from './customer.controller';
import { AuthModule } from '../auth/auth.module';
import { RabbitModule } from 'src/shared/providers/rabbitMq.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Customer, Payment, Seller]),
    forwardRef(() => AuthModule),
    RabbitModule,
  ],
  controllers: [CustomerController],
  providers: [CustomerService],
  exports: [CustomerService],
})
export class CustomerModule {}
