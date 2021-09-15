import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Customer } from '../customer/entities/customer.entity';
import { Seller } from '../seller/entities/seller.entity';
import { DebitCard } from './entities/debit-card.entity';
import { Payment } from './entities/payment.entity';
import { PaymentController } from './payment.controller';
import { PaymentService } from './payment.service';
import { Wallet } from '../seller/entities/wallet.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Customer, Payment, Seller, DebitCard, Wallet]),
    HttpModule,
  ],
  controllers: [PaymentController],
  providers: [PaymentService],
  exports: [PaymentService],
})
export class PaymentModule {}
