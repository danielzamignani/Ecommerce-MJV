import { forwardRef, Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { CustomerModule } from '../customer/customer.module';
import { SellerModule } from '../seller/seller.module';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { LocalStrategy } from './local/local-strategy';

@Module({
  imports: [
       forwardRef(() => CustomerModule),
       forwardRef(() => SellerModule), 
       PassportModule
    ],
  providers: [
      AuthService, 
      LocalStrategy
    ],
   controllers: [
       AuthController,
   ],
   exports: [
       AuthService
   ]
})
export class AuthModule {}
