import {
  Controller,
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
  ApiOperation,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { DecodeJwt } from 'src/shared/decorators/decode-jwt.decortator';
import { LogHttpInterceptor } from 'src/shared/interceptors/loghttp.interceptor';
import { JwtAuthGuard } from '../auth/jwt/jwt-strategy.guard';
import { CreatePaymentDTO } from './dtos/create-payment.dto';
import { PaymentService } from './payment.service';
import { CustomerGuard } from 'src/shared/guards/customer.guard';
import { Channel } from 'amqplib';
import { CieloRequisitonResponseSchema } from 'src/schemas/cieloRequisitionResponse.schema';
import { validatePaymentResponseSchema } from 'src/schemas/validatePaymentResponse.schema';

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
  @ApiNotFoundResponse({ description: 'Seller not found' })
  @ApiUnauthorizedResponse({ description: 'Invalid token' })
  @ApiBearerAuth('JWT-auth')
  @Post()
  async createPayment(
    @Body() createPaymentDTO: CreatePaymentDTO,
    @DecodeJwt() auth: any,
  ) {
    return await this.paymentService.createPayment(createPaymentDTO, auth.id);
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
    return await this.paymentService.validatePayment(id);
  }
}
