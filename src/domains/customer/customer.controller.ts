import {
  Body,
  Controller,
  Get,
  Post,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiConflictResponse,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { DecodeJwt } from 'src/shared/decorators/decode-jwt.decortator';
import { CustomerGuard } from 'src/shared/guards/customer.guard';
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

  @UseGuards(JwtAuthGuard, CustomerGuard)
  @ApiOkResponse({ description: 'Show customer profile' })
  @ApiUnauthorizedResponse({ description: 'Invalid Token' })
  @ApiBearerAuth('JWT-auth')
  @Get('/profile')
  findCustomerById(@DecodeJwt() auth: any) {
    return this.customerService.findCustomerById(auth.id);
  }

  @UseGuards(JwtAuthGuard, CustomerGuard)
  @ApiOkResponse({ description: 'Show all customer payments' })
  @ApiUnauthorizedResponse({ description: 'Invalid Token' })
  @ApiBearerAuth('JWT-auth')
  @Get('/payments')
  findCustomerPayments(@DecodeJwt() auth: any) {
    return this.customerService.findCustomerPayments(auth.id);
  }
}
