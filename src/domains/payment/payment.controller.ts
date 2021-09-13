import { Controller, Get, Post, Body, Patch, Request, Param, Delete, ClassSerializerInterceptor, UseInterceptors, UseGuards } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { CreatePaymentDTO } from './dto/create-payment.dto';
import { PaymentService } from './payment.service';


@ApiTags('Payment')
@Controller('payment')
export class PaymentController {
  constructor(
    private readonly paymentService: PaymentService,
    ) {}


  @Post()
  createPayment(@Body() createPaymentDTO: CreatePaymentDTO) {
    return this.paymentService.createPayment(createPaymentDTO);
  }

  @Get(':id')
  findPaymentById(@Param('id') id: string) {
    return this.paymentService.findPaymentById(id);
  }
}
