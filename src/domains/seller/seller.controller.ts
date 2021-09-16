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
import { ApiTags } from '@nestjs/swagger';
import { DecodeJwt } from 'src/shared/decorators/decode-jwt.decortator';
import { LogHttpInterceptor } from 'src/shared/interceptors/loghttp.interceptor';
import { JwtAuthGuard } from '../auth/jwt/jwt-strategy.guard';
import { CreateSellerDTO } from '../seller/dto/create-seller.dto';
import { SellerService } from '../seller/seller.service';

@UseInterceptors(LogHttpInterceptor)
@ApiTags('Seller')
@Controller('seller')
export class SellerController {
  constructor(private readonly sellerService: SellerService) {}

  @Post()
  createSeller(@Body() createSellerDTO: CreateSellerDTO) {
    return this.sellerService.createSeller(createSellerDTO);
  }

  @UseGuards(JwtAuthGuard)
  @Get('profile')
  findSellerById(@DecodeJwt() auth: any) {
    return this.sellerService.findSellerById(auth.id);
  }

  @UseGuards(JwtAuthGuard)
  @Get('payments')
  findSellerPayments(@DecodeJwt() auth: any) {
    return this.sellerService.findSellerPayments(auth.id);
  }

  @UseGuards(JwtAuthGuard)
  @Get('wallet')
  findSellerWallet(@DecodeJwt() auth: any) {
    return this.sellerService.findSellerWallet(auth.id);
  }
}
