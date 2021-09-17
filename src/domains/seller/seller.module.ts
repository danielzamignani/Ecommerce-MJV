import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Payment } from '../payment/entities/payment.entity';
import { Seller } from './entities/seller.entity';
import { SellerService } from './seller.service';
import { Customer } from '../customer/entities/customer.entity';
import { SellerController } from './seller.controller';
import { Wallet } from './entities/wallet.entity';
import { AuthModule } from '../auth/auth.module';
import { ClientsModule, Transport } from '@nestjs/microservices';

@Module({
  imports: [
    TypeOrmModule.forFeature([Customer, Payment, Seller, Wallet]),
    forwardRef(() => AuthModule),
    ClientsModule.register([
      {
        name: 'LOGHTTP-SERVICE',
        transport: Transport.RMQ,
        options: {
          urls: ['amqp://admin:admin@localhost:5672'],
          prefetchCount: 1,
          queue: 'loghttp',
          queueOptions: {
            durable: true,
          },
        },
      },
    ]),
  ],
  controllers: [SellerController],
  providers: [SellerService],
  exports: [SellerService],
})
export class SellerModule {}
