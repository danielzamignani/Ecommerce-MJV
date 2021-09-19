import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiTags,
} from '@nestjs/swagger';
import {
  cieloHeaderConfig,
  cieloURLGet,
  cieloURLPost,
} from 'src/common/config/cielo.config';
import { DecodeJwt } from 'src/shared/decorators/decode-jwt.decortator';
import { LogHttpInterceptor } from 'src/shared/interceptors/loghttp.interceptor';
import { JwtAuthGuard } from '../auth/jwt/jwt-strategy.guard';
import { CreatePaymentDTO } from './dto/create-payment.dto';
import { PaymentService } from './payment.service';
import axios from 'axios';

@UseInterceptors(LogHttpInterceptor)
@ApiTags('Payment')
@Controller('payment')
export class PaymentController {
  constructor(private readonly paymentService: PaymentService) {}

  @UseGuards(JwtAuthGuard)
  @ApiCreatedResponse({ description: 'Create a payment' })
  @ApiBearerAuth('JWT-auth')
  @Post()
  async createPayment(
    @Body() createPaymentDTO: CreatePaymentDTO,
    @DecodeJwt() auth: any,
  ) {
    const cieloPostDTO = await this.paymentService.createPayment(
      createPaymentDTO,
      auth.id,
    );

    const response = await axios
      .post(cieloURLPost, cieloPostDTO, cieloHeaderConfig)
      .then(function (response) {
        return response;
      })
      .catch(function (error) {
        return error;
      });

    return response.data;
  }

  @UseGuards(JwtAuthGuard)
  @ApiCreatedResponse({ description: 'Validate the payment' })
  @ApiBearerAuth('JWT-auth')
  @Post('validation/:id')
  async validatePayment(@Param('id') id: string) {
    console.log(`${cieloURLGet}${id}`);
    const response = await axios
      .get(`${cieloURLGet}${id}`, cieloHeaderConfig)
      .then(function (response) {
        if (response.data.Payment.Status === 2) return response;
      })
      .catch(function (error) {
        return error;
      });

    const orderId = response.data.MerchantOrderId;

    return this.paymentService.validatePayment(orderId);
  }

  @UseGuards(JwtAuthGuard)
  @ApiOkResponse({ description: 'Find payment by ID' })
  @ApiBearerAuth('JWT-auth')
  @Get(':id')
  findPaymentById(@Param('id') id: string) {
    return this.paymentService.findPaymentById(id);
  }
}
