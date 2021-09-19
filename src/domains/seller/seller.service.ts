import {
  ConflictException,
  HttpException,
  HttpStatus,
  Injectable,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import * as uuid from 'uuid';
import { Repository } from 'typeorm';
import { Seller } from './entities/seller.entity';
import { CreateSellerDTO } from './dto/create-seller.dto';
import { Wallet } from './entities/wallet.entity';
import { Payment } from '../payment/entities/payment.entity';

@Injectable()
export class SellerService {
  @InjectRepository(Seller)
  private readonly sellerRepository: Repository<Seller>;
  @InjectRepository(Wallet)
  private readonly walletRepository: Repository<Wallet>;
  @InjectRepository(Payment)
  private readonly paymentRepository: Repository<Payment>;

  async createSeller({ name, email, password }: CreateSellerDTO) {
    const userAlreadyExists = await this.findSellerByEmail(email);

    if (userAlreadyExists) {
      throw new ConflictException('This email is already in use');
    }

    let seller = new Seller();

    const id = uuid.v4();

    const wallet = await this.createWallet(name);

    const saltOrRounds = 10;
    password = await bcrypt.hash(password, saltOrRounds);

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

  async findSellerPayments(id: string) {
    const seller = await this.sellerRepository.findOne(id);

    const payments = await this.paymentRepository.find({
      where: { seller: seller },
    });

    return payments;
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
    const seller = await this.sellerRepository.findOne(id);

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
