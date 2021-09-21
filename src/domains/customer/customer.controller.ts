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
  ApiOperation,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { CustomerProfileResponseSchema } from 'src/schemas/customerProfileResponse. schema';
import { GetCustomerPaymentsResponseSchema } from 'src/schemas/getCustomerPaymentsResponse.schema';
import { DecodeJwt } from 'src/shared/decorators/decode-jwt.decortator';
import { AuthenticatedUser } from 'src/shared/dtos/authenticatedUser.dto';
import { CustomerGuard } from 'src/shared/guards/customer.guard';
import { LogHttpInterceptor } from 'src/shared/interceptors/loghttp.interceptor';
import { JwtAuthGuard } from '../auth/jwt/jwt-strategy.guard';
import { CustomerService } from './customer.service';
import { CreateCustomerDTO } from './dtos/create-customer.dto';

@UseInterceptors(LogHttpInterceptor)
@ApiTags('Customer')
@Controller('customer')
export class CustomerController {
  constructor(private readonly customerService: CustomerService) {}

  @ApiOperation({
    summary: 'Create a customer account',
    description: 'Create a customer account in API',
  })
  @ApiCreatedResponse({ description: 'Customer account created' })
  @ApiConflictResponse({ description: 'Email already in use' })
  @Post()
  createCustomer(@Body() createCustomerDTO: CreateCustomerDTO) {
    return this.customerService.createCustomer(createCustomerDTO);
  }

  @UseGuards(JwtAuthGuard, CustomerGuard)
  @ApiOperation({
    summary: "Show customer's profile",
    description: "Get basic customer's informations",
  })
  @ApiOkResponse({
    description: "Return customer's profile",
    schema: CustomerProfileResponseSchema,
  })
  @ApiUnauthorizedResponse({ description: 'Invalid Token' })
  @ApiBearerAuth('JWT-auth')
  @Get('/profile')
  findCustomerById(@DecodeJwt() auth: AuthenticatedUser) {
    return this.customerService.findCustomerById(auth.id);
  }

  @UseGuards(JwtAuthGuard, CustomerGuard)
  @ApiOperation({
    summary: "Show all customer's payments",
    description: 'Get all customer payments',
  })
  @ApiOkResponse({
    description: "Return all customer's payments",
    schema: GetCustomerPaymentsResponseSchema,
  })
  @ApiUnauthorizedResponse({ description: 'Invalid Token' })
  @ApiBearerAuth('JWT-auth')
  @Get('/payments')
  findCustomerPayments(@DecodeJwt() auth: AuthenticatedUser) {
    return this.customerService.findCustomerPayments(auth.id);
  }
}
