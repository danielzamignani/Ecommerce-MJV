import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ClientsModule } from '@nestjs/microservices';
import { TypeOrmModule } from '@nestjs/typeorm';
import { getConnectionOptions } from 'typeorm';
import { CustomerModule } from './domains/customer/customer.module';
import { PaymentModule } from './domains/payment/payment.module';
import { SellerModule } from './domains/seller/seller.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forRootAsync({
      useFactory: async () =>
        Object.assign(await getConnectionOptions(), {
          autoLoadEntities: true,
        }),
    }),
    CustomerModule,
    PaymentModule,
    SellerModule,
    ClientsModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
