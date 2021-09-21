import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Customer } from '../customer/entities/customer.entity';
import { Seller } from '../seller/entities/seller.entity';
import { DebitCard } from './entities/debit-card.entity';
import { Payment } from './entities/payment.entity';
import { PaymentController } from './payment.controller';
import { PaymentService } from './payment.service';
import { Wallet } from '../seller/entities/wallet.entity';

import { Transaction } from './entities/transaction.entity';
import { RabbitModule } from 'src/shared/providers/rabbitMq.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Customer,
      Payment,
      Seller,
      DebitCard,
      Wallet,
      Transaction,
    ]),
    RabbitModule,
  ],
  controllers: [PaymentController],
  providers: [PaymentService],
  exports: [PaymentService],
})
export class PaymentModule {}
