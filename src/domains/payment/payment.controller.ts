import { HttpService } from '@nestjs/axios';
import { Controller, Get, Post, Body, Param, UseGuards } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/jwt/jwt-strategy.guard';
import { CreatePaymentDTO } from './dto/create-payment.dto';
import { PaymentService } from './payment.service';

@ApiTags('Payment')
@Controller('payment')
export class PaymentController {
  constructor(
    private readonly paymentService: PaymentService,
    private httpService: HttpService,
  ) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  createPayment(@Body() createPaymentDTO: CreatePaymentDTO) {
    return this.paymentService.createPayment(createPaymentDTO);
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  findPaymentById(@Param('id') id: string) {
    return this.paymentService.findPaymentById(id);
  }
}
