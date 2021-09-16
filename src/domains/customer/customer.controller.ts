import { Body, Controller, Get, Inject, Post, UseGuards } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { ApiTags } from '@nestjs/swagger';
import { DecodeJwt } from 'src/shared/decorators/decode-jwt.decortator';
import { JwtAuthGuard } from '../auth/jwt/jwt-strategy.guard';
import { CustomerService } from './customer.service';
import { CreateCustomerDTO } from './dto/create-customer.dto';

@ApiTags('Customer')
@Controller('customer')
export class CustomerController {
  constructor(
    private readonly customerService: CustomerService,
    @Inject('LOGHTTP_SERVICE') private readonly client: ClientProxy,
  ) {}

  @Post()
  createCustomer(@Body() createCustomerDTO: CreateCustomerDTO) {
    return this.customerService.createCustomer(createCustomerDTO);
  }

  @UseGuards(JwtAuthGuard)
  @Get('/profile')
  findCustomerProfile(@DecodeJwt() auth: any) {
    return this.customerService.findCustomerProfile(auth.id);
  }

  @UseGuards(JwtAuthGuard)
  @Get('/payments')
  findCustomerPayments(@DecodeJwt() auth: any) {
    return this.customerService.findCustomerPayments(auth.id);
  }

  @Get()
  print() {
    return this.client.send(
      {
        cmd: 'add-subscriber',
      },
      'test',
    );
  }
}
