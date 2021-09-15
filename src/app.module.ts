import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';

import { TypeOrmModule } from '@nestjs/typeorm';
import { getConnectionOptions } from 'typeorm';
import { AuthModule } from './domains/auth/auth.module';
import { CustomerModule } from './domains/customer/customer.module';
import { PaymentModule } from './domains/payment/payment.module';
import { SellerModule } from './domains/seller/seller.module';

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
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
