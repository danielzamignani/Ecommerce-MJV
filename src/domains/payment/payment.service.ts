import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreatePaymentDTO } from './dto/create-payment.dto';
import { Payment } from './entities/payment.entity';
import * as uuid from 'uuid';
import { DebitCard } from './entities/debit-card.entity';
import { CreateDebitCardDTO } from './dto/create-debit-card.dto';
import { Seller } from '../seller/entities/seller.entity';
import { Wallet } from '../seller/entities/wallet.entity';

@Injectable()
export class PaymentService {
  @InjectRepository(Seller)
  private readonly sellerRepository: Repository<Seller>;
  @InjectRepository(Payment)
  private readonly paymentRepository: Repository<Payment>;
  @InjectRepository(DebitCard)
  private readonly debitCardRepository: Repository<DebitCard>;
  @InjectRepository(Wallet)
  private readonly walletRepository: Repository<Wallet>;

  async createPayment(createPaymentDTO: CreatePaymentDTO) {
    let payment = new Payment();

    const cardInfo = createPaymentDTO.debitCard;

    const card = await this.createDebitCard(cardInfo);

    const id = uuid.v4();

    Object.assign(payment, {
      id,
      amount: createPaymentDTO.amount,
      customer: createPaymentDTO.customer,
      seller: createPaymentDTO.seller,
      debitCard: card,
    });

    payment = await this.paymentRepository.save(payment);

    await this.updateWallet(
      createPaymentDTO.amount,
      createPaymentDTO.seller.id,
    );

    return payment;
  }

  async findPaymentById(id: string) {
    const payment = await this.paymentRepository.findOne(id);

    return payment;
  }

  async createDebitCard(cardInfo: CreateDebitCardDTO) {
    let card = new DebitCard();

    const id = uuid.v4();

    Object.assign(card, {
      id,
      holder: cardInfo.holder,
      brand: cardInfo.brand,
      cardNumber: cardInfo.cardNumber,
      expirationDate: cardInfo.expirationDate,
      securityCode: cardInfo.securityCode,
    });

    card = await this.debitCardRepository.save(card);

    return card;
  }

  async updateWallet(amount: number, sellerId: string) {
    const seller = await this.sellerRepository.findOne(sellerId);
    const wallet = await this.walletRepository.findOne(seller.wallet.id);

    wallet.amount += amount;

    await this.walletRepository.save(wallet);
  }
}
