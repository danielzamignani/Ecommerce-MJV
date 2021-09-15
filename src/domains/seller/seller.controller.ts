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
  createUser(@Body() createSellerDTO: CreateSellerDTO) {
    return this.sellerService.createSeller(createSellerDTO);
  }

  @UseGuards(JwtAuthGuard)
  @Get('wallet')
  async findSellerWallet(@DecodeJwt() auth: any) {
    return this.sellerService.findSellerWallet(auth.id);
  }
}
