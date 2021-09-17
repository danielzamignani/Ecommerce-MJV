import { forwardRef, Module } from '@nestjs/common';
import { CustomerService } from './customer.service';
import { Customer } from './entities/customer.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Payment } from '../payment/entities/payment.entity';
import { Seller } from '../seller/entities/seller.entity';
import { CustomerController } from './customer.controller';
import { AuthModule } from '../auth/auth.module';
import { ClientsModule, Transport } from '@nestjs/microservices';

@Module({
  imports: [
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
    TypeOrmModule.forFeature([Customer, Payment, Seller]),
    forwardRef(() => AuthModule),
  ],
  controllers: [CustomerController],
  providers: [CustomerService],
  exports: [CustomerService],
})
export class CustomerModule {}
