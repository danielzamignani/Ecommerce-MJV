import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { getConnectionOptions } from 'typeorm';
import { CustomerModule } from './domains/customer/customer.module';
import { PaymentModule } from './domains/payment/payment.module';
import { SellerModule } from './domains/seller/seller.module';
import { RabbitModule } from './shared/providers/rabbitMq.module';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      useFactory: async () =>
        Object.assign(await getConnectionOptions(), {
          autoLoadEntities: true,
        }),
    }),
    CustomerModule,
    PaymentModule,
    SellerModule,
    RabbitModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
