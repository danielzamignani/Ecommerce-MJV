import {
  Body,
  Controller,
  Get,
  Inject,
  Post,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import {
  ApiBearerAuth,
  ApiConflictResponse,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiTags,
} from '@nestjs/swagger';
import { DecodeJwt } from 'src/shared/decorators/decode-jwt.decortator';
import { LogHttpInterceptor } from 'src/shared/interceptors/loghttp.interceptor';
import { JwtAuthGuard } from '../auth/jwt/jwt-strategy.guard';
import { CustomerService } from './customer.service';
import { CreateCustomerDTO } from './dto/create-customer.dto';

@UseInterceptors(LogHttpInterceptor)
@ApiTags('Customer')
@Controller('customer')
export class CustomerController {
  constructor(private readonly customerService: CustomerService) {}

  @ApiCreatedResponse({ description: 'Create a customer account' })
  @ApiConflictResponse({ description: 'Email already in use' })
  @Post()
  createCustomer(@Body() createCustomerDTO: CreateCustomerDTO) {
    return this.customerService.createCustomer(createCustomerDTO);
  }

  @UseGuards(JwtAuthGuard)
  @ApiOkResponse({ description: 'Show customer profile' })
  @ApiBearerAuth('JWT-auth')
  @Get('/profile')
  findCustomerProfile(@DecodeJwt() auth: any) {
    return this.customerService.findCustomerProfile(auth.id);
  }

  @UseGuards(JwtAuthGuard)
  @ApiOkResponse({ description: 'Show all customer payments' })
  @ApiBearerAuth('JWT-auth')
  @Get('/payments')
  findCustomerPayments(@DecodeJwt() auth: any) {
    return this.customerService.findCustomerPayments(auth.id);
  }
}
