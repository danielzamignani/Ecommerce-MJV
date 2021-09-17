import { forwardRef, Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { CustomerModule } from '../customer/customer.module';
import { SellerModule } from '../seller/seller.module';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { LocalStrategy } from './local/local-strategy';
import { JwtModule } from '@nestjs/jwt';
import { jwtConstants } from './jwt/constants';
import { JwtStrategy } from './jwt/jwt-strategy';
import { ClientsModule, Transport } from '@nestjs/microservices';

@Module({
  imports: [
    forwardRef(() => CustomerModule),
    forwardRef(() => SellerModule),
    PassportModule,
    JwtModule.register({
      secret: jwtConstants.secret,
      signOptions: { expiresIn: '300s' },
    }),
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
  providers: [AuthService, LocalStrategy, JwtStrategy],
  controllers: [AuthController],
  exports: [AuthService],
})
export class AuthModule {}
