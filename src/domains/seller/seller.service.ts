import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import * as uuid from 'uuid';
import { Repository } from 'typeorm';
import { Seller } from './entities/seller.entity';
import { CreateSellerDTO } from './dto/create-seller.dto';
import { Wallet } from './entities/wallet.entity';

@Injectable()
export class SellerService {
  @InjectRepository(Seller)
  private readonly sellerRepository: Repository<Seller>;
  @InjectRepository(Wallet)
  private readonly walletRepository: Repository<Wallet>;

  async createSeller({ name, email, password }: CreateSellerDTO) {
    let seller = new Seller();

    const id = uuid.v4();

    const wallet = await this.createWallet(name);

    Object.assign(seller, {
      id,
      name,
      email,
      password,
      wallet,
    });

    seller = await this.sellerRepository.save(seller);

    return seller;
  }

  async findSellerById(id: string) {
    const seller = await this.sellerRepository.findOne(id);

    return seller;
  }

  async findSellerByEmail(email: string) {
    const seller = await this.sellerRepository.findOne({
      where: { email: email },
    });

    return seller;
  }

  async findSellerWallet(id: string) {
    const seller = await this.findSellerById(id);

    return seller.wallet;
  }

  async createWallet(sellerName: string) {
    const wallet = new Wallet();

    const id = uuid.v4();

    Object.assign(wallet, {
      id,
      sellerName,
    });

    return await this.walletRepository.save(wallet);
  }
}
