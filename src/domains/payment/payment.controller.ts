import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  UseGuards,
  UseInterceptors,
  Patch,
  Inject,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import {
  cieloHeaderConfig,
  cieloURLGet,
  cieloURLPost,
} from 'src/shared/config/cielo.config';
import { DecodeJwt } from 'src/shared/decorators/decode-jwt.decortator';
import { LogHttpInterceptor } from 'src/shared/interceptors/loghttp.interceptor';
import { JwtAuthGuard } from '../auth/jwt/jwt-strategy.guard';
import { CreatePaymentDTO } from './dtos/create-payment.dto';
import { PaymentService } from './payment.service';
import axios from 'axios';
import { CustomerGuard } from 'src/shared/guards/customer.guard';
import { HttpLogDTO } from 'src/shared/dtos/httplog.dto';
import { ClientProxy } from '@nestjs/microservices';
import { Channel } from 'amqplib';
import { CieloRequisitonResponseSchema } from 'src/schemas/cieloRequisitionResponse.schema';
import { validatePaymentResponseSchema } from 'src/schemas/validatePaymentResponse.schema';
import { rabbitMqQueue } from 'src/shared/config/rabbitMq.config';

@UseInterceptors(LogHttpInterceptor)
@ApiTags('Payment')
@Controller('payment')
export class PaymentController {
  constructor(
    private readonly paymentService: PaymentService,
    @Inject('RABBIT_PUBLISH_CHANNEL')
    private readonly publishChannel: Channel,
  ) {}

  @UseGuards(JwtAuthGuard, CustomerGuard)
  @ApiOperation({
    summary: 'Create a payment requisition',
    description: 'Create a payment and send to CieloAPI',
  })
  @ApiCreatedResponse({
    description: 'Payment requisition created',
    schema: CieloRequisitonResponseSchema,
  })
  @ApiUnauthorizedResponse({ description: 'Invalid token' })
  @ApiBearerAuth('JWT-auth')
  @Post()
  async createPayment(
    @Body() createPaymentDTO: CreatePaymentDTO,
    @DecodeJwt() auth: any,
  ) {
    const cieloPostDTO = await this.paymentService
      .createPayment(createPaymentDTO, auth.id)
      .then(function (cieloPostDTO) {
        return cieloPostDTO;
      });

    const response = await axios
      .post(cieloURLPost, cieloPostDTO, cieloHeaderConfig)
      .then(function (response) {
        return response;
      })
      .catch(function (error) {
        return error;
      });

    const httpLogDTO: HttpLogDTO = {
      url: cieloURLPost,
      method: 'POST',
      headers: cieloHeaderConfig,
      body: cieloPostDTO,
    };

    this.publishChannel.sendToQueue(
      rabbitMqQueue,
      Buffer.from(JSON.stringify(httpLogDTO)),
      {
        persistent: true,
      },
    );

    return response.data;
  }

  @ApiOperation({
    summary: 'Confirm payment requisition',
    description: 'Confirm payment and add amount to seller wallet',
  })
  @ApiCreatedResponse({
    description: 'Payment confirmed',
    schema: validatePaymentResponseSchema,
  })
  @ApiUnauthorizedResponse({ description: 'Invalid token' })
  @ApiBearerAuth('JWT-auth')
  @Patch('validation/:id')
  async validatePayment(@Param('id') id: string) {
    const response = await axios
      .get(`${cieloURLGet}${id}`, cieloHeaderConfig)
      .then(function (response) {
        if (response.data.Payment.Status === 2) {
          return response;
        }
      })
      .catch(function (error) {
        return error;
      });

    const httpLogDTO: HttpLogDTO = {
      url: cieloURLPost,
      method: 'GET',
      headers: cieloHeaderConfig,
      body: {},
    };

    this.publishChannel.sendToQueue(
      rabbitMqQueue,
      Buffer.from(JSON.stringify(httpLogDTO)),
      {
        persistent: true,
      },
    );

    const orderId = response.data.MerchantOrderId;

    return this.paymentService.validatePayment(orderId);
  }
}
