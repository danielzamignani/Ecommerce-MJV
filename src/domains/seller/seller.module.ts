import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Payment } from '../payment/entities/payment.entity';
import { Seller } from './entities/seller.entity';
import { SellerService } from './seller.service';
import { Customer } from '../customer/entities/customer.entity';
import { SellerController } from './seller.controller';
import { Wallet } from './entities/wallet.entity';
import { AuthModule } from '../auth/auth.module';
import { RabbitModule } from 'src/shared/providers/rabbitMq.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Customer, Payment, Seller, Wallet]),
    forwardRef(() => AuthModule),
    RabbitModule,
  ],
  controllers: [SellerController],
  providers: [SellerService],
  exports: [SellerService],
})
export class SellerModule {}
