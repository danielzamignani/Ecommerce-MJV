import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { CustomerStrategy } from './local/customer-strategy';
import { JwtModule } from '@nestjs/jwt';
import { jwtConstants } from './jwt/constants';
import { SellerStrategy } from './local/seller-strategy';
import { Customer } from '../customer/entities/customer.entity';
import { Seller } from '../seller/entities/seller.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtStrategy } from './jwt/jwt-strategy';
import { RabbitModule } from 'src/shared/providers/rabbitMq.module';

@Module({
  imports: [
    PassportModule,
    TypeOrmModule.forFeature([Customer, Seller]),
    JwtModule.register({
      secret: jwtConstants.secret,
      signOptions: { expiresIn: '1000s' },
    }),
    RabbitModule,
  ],
  providers: [AuthService, CustomerStrategy, SellerStrategy, JwtStrategy],
  controllers: [AuthController],
  exports: [AuthService],
})
export class AuthModule {}
