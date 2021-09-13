import { Body, Controller, Get, Param, Post } from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
import { CreateSellerDTO } from "../seller/dto/create-seller.dto";
import { SellerService } from "../seller/seller.service";


@ApiTags('Seller')
@Controller('seller')
export class SellerController {
  constructor(
    private readonly sellerService: SellerService,
    ) {}


  @Post()
  createUser(@Body() createSellerDTO: CreateSellerDTO) {
    return this.sellerService.createSeller(createSellerDTO);
  }

  @Get('wallet/:id')
  findSellerWallet(@Param('id') id: string) {
    return this.sellerService.findSellerWallet(id);  
  }
}