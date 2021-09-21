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
import { DecodeJwt } from 'src/shared/decorators/decode-jwt.decortator';
import { AuthenticatedUser } from 'src/shared/dtos/authenticatedUser.dto';
import { SellerGuard } from 'src/shared/guards/seller.guard';
import { LogHttpInterceptor } from 'src/shared/interceptors/loghttp.interceptor';
import { JwtAuthGuard } from '../auth/jwt/jwt-strategy.guard';
import { CreateSellerDTO } from './dtos/create-seller.dto';
import { SellerService } from '../seller/seller.service';
import { SellerProfileResponseSchema } from 'src/schemas/sellerProfileResponse.schema';
import { GetSellerPaymentsResponseSchema } from 'src/schemas/getSellerPaymentsResponse.schema';
import { SellerWalletResponse } from 'src/schemas/sellerWalletResponse.schema';

@UseInterceptors(LogHttpInterceptor)
@ApiTags('Seller')
@Controller('seller')
export class SellerController {
  constructor(private readonly sellerService: SellerService) {}

  @ApiOperation({
    summary: 'Create a seller account',
    description: 'Create a seller account in API',
  })
  @ApiCreatedResponse({ description: 'Seller account created' })
  @ApiConflictResponse({ description: 'Email already in use' })
  @Post()
  createSeller(@Body() createSellerDTO: CreateSellerDTO) {
    return this.sellerService.createSeller(createSellerDTO);
  }

  @UseGuards(JwtAuthGuard, SellerGuard)
  @ApiOperation({
    summary: "Show seller's profile",
    description: "Get basic seller's informations",
  })
  @ApiOkResponse({
    description: "Return seller's profile",
    schema: SellerProfileResponseSchema,
  })
  @ApiUnauthorizedResponse({ description: 'Invalid Token' })
  @ApiBearerAuth('JWT-auth')
  @Get('profile')
  findSellerById(@DecodeJwt() auth: AuthenticatedUser) {
    return this.sellerService.findSellerById(auth.id);
  }

  @UseGuards(JwtAuthGuard, SellerGuard)
  @ApiOperation({
    summary: "Show all seller's payments",
    description: "Get all seller's payments",
  })
  @ApiOkResponse({
    description: 'Return all seller payments',
    schema: GetSellerPaymentsResponseSchema,
  })
  @ApiUnauthorizedResponse({ description: 'Invalid Token' })
  @ApiBearerAuth('JWT-auth')
  @Get('payments')
  findSellerPayments(@DecodeJwt() auth: AuthenticatedUser) {
    return this.sellerService.findSellerPayments(auth.id);
  }

  @UseGuards(JwtAuthGuard, SellerGuard)
  @ApiOperation({
    summary: "Show seller's wallet",
    description: "Get the seller's wallet",
  })
  @ApiOkResponse({
    description: "Return seller's wallet",
    schema: SellerWalletResponse,
  })
  @ApiUnauthorizedResponse({ description: 'Invalid Token' })
  @ApiBearerAuth('JWT-auth')
  @Get('wallet')
  findSellerWallet(@DecodeJwt() auth: AuthenticatedUser) {
    return this.sellerService.findSellerWallet(auth.id);
  }
}
