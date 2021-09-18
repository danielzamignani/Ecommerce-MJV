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
import { ClientsModule, Transport } from '@nestjs/microservices';
import { Transaction } from './entities/transaction.entity';

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
    HttpModule,
    ClientsModule.register([
      {
        name: 'LOGHTTP-SERVICE',
        transport: Transport.RMQ,
        options: {
          urls: ['amqp://admin:admin@localhost:5672'],
          prefetchCount: 1,
          queue: 'loghttp',
          noAck: false,
          queueOptions: {
            durable: true,
          },
        },
      },
    ]),
  ],
  controllers: [PaymentController],
  providers: [PaymentService],
  exports: [PaymentService],
})
export class PaymentModule {}
