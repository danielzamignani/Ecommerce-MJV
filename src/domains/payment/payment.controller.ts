import { HttpService } from '@nestjs/axios';
import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  UseGuards,
  UseInterceptors,
  HttpException,
  Inject,
} from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { ApiTags } from '@nestjs/swagger';
import { AxiosResponse } from 'axios';
import { catchError, map, Observable } from 'rxjs';
import { cieloHeaderConfig } from 'src/common/config/cielo.config';
import { DecodeJwt } from 'src/shared/decorators/decode-jwt.decortator';
import { LogHttpInterceptor } from 'src/shared/interceptors/loghttp.interceptor';
import { PaymentInterceptor } from 'src/shared/interceptors/payment.interceptor';
import { JwtAuthGuard } from '../auth/jwt/jwt-strategy.guard';
import { CieloPaymentDTO } from './dto/cielo-payment-dto';
import { PaymentService } from './payment.service';

@UseInterceptors(LogHttpInterceptor)
@ApiTags('Payment')
@Controller('payment')
export class PaymentController {
  constructor(
    private readonly paymentService: PaymentService,
    private readonly httpService: HttpService,
  ) {}

  @UseGuards(JwtAuthGuard)
  @UseInterceptors(PaymentInterceptor)
  @Post(':id')
  createPayment(
    @Body() cieloPaymentDTO: CieloPaymentDTO,
    @Param('id') id: string,
    @DecodeJwt() auth: any,
  ) {
    //  const sellerId = id;
    //  const customerId = auth.id;
    //
    //  await this.paymentService.createPayment(
    //    cieloPaymentDTO,
    //    sellerId,
    //    customerId,
    //  );
    const response = this.httpService
      .post(
        'https://apisandbox.cieloecommerce.cielo.com.br/1/sales/',
        cieloPaymentDTO,
        cieloHeaderConfig,
      )
      .pipe(map((response) => response.data as string));
    console.log(map((response) => response));
    return response;
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  findPaymentById(@Param('id') id: string) {
    return this.paymentService.findPaymentById(id);
  }
}
