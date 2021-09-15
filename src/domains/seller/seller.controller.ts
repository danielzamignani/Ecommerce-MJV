import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { DecodeJwt } from 'src/shared/decorators/decode-jwt.decortator';
import { JwtAuthGuard } from '../auth/jwt/jwt-strategy.guard';
import { CreateSellerDTO } from '../seller/dto/create-seller.dto';
import { SellerService } from '../seller/seller.service';

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
  async findSellerById(@DecodeJwt() auth: any) {
    return this.sellerService.findSellerById(auth.id);
  }

  @UseGuards(JwtAuthGuard)
  @Get('payments')
  async findSellerPayments(@DecodeJwt() auth: any) {
    return this.sellerService.findSellerPayments(auth.id);
  }

  @UseGuards(JwtAuthGuard)
  @Get('wallet')
  async findSellerWallet(@DecodeJwt() auth: any) {
    return this.sellerService.findSellerWallet(auth.id);
  }
}
