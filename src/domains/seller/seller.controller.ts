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
import { AuthenticatedUser } from 'src/shared/dtos/authenticatedUser.dto';
import { SellerGuard } from 'src/shared/guards/seller.guard';
import { LogHttpInterceptor } from 'src/shared/interceptors/loghttp.interceptor';
import { JwtAuthGuard } from '../auth/jwt/jwt-strategy.guard';
import { CreateSellerDTO } from './dtos/create-seller.dto';
import { SellerService } from '../seller/seller.service';

@UseInterceptors(LogHttpInterceptor)
@ApiTags('Seller')
@Controller('seller')
export class SellerController {
  constructor(private readonly sellerService: SellerService) {}

  @ApiCreatedResponse({ description: 'Create a customer account' })
  @ApiConflictResponse({ description: 'Email already in use' })
  @Post()
  createSeller(@Body() createSellerDTO: CreateSellerDTO) {
    return this.sellerService.createSeller(createSellerDTO);
  }

  @UseGuards(JwtAuthGuard, SellerGuard)
  @ApiOkResponse({ description: 'Show seller profile' })
  @ApiUnauthorizedResponse({ description: 'Invalid Token' })
  @ApiBearerAuth('JWT-auth')
  @Get('profile')
  findSellerById(@DecodeJwt() auth: AuthenticatedUser) {
    return this.sellerService.findSellerById(auth.id);
  }

  @UseGuards(JwtAuthGuard, SellerGuard)
  @ApiOkResponse({ description: 'Show all seller payments' })
  @ApiUnauthorizedResponse({ description: 'Invalid Token' })
  @ApiBearerAuth('JWT-auth')
  @Get('payments')
  findSellerPayments(@DecodeJwt() auth: AuthenticatedUser) {
    return this.sellerService.findSellerPayments(auth.id);
  }

  @UseGuards(JwtAuthGuard, SellerGuard)
  @ApiOkResponse({ description: 'Show seller wallet' })
  @ApiUnauthorizedResponse({ description: 'Invalid Token' })
  @ApiBearerAuth('JWT-auth')
  @Get('wallet')
  findSellerWallet(@DecodeJwt() auth: AuthenticatedUser) {
    return this.sellerService.findSellerWallet(auth.id);
  }
}
