import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Payment } from './entities/payment.entity';
import * as uuid from 'uuid';
import { DebitCard } from './entities/debit-card.entity';
import { CreateDebitCardDTO } from './dto/create-debit-card.dto';
import { Seller } from '../seller/entities/seller.entity';
import { Wallet } from '../seller/entities/wallet.entity';
import { CreatePaymentDTO } from './dto/create-payment.dto';

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

  //  async createPayment(
  //    cieloPaymentDTO: CreatePaymentDTO,
  //    sellerId: string,
  //    customerId: string,
  //  ) {
  //    let payment = new Payment();
  //
  //    const card = await this.createDebitCard(cieloPaymentDTO.payment.debitCard);
  //
  //    const id = uuid.v4();
  //
  //    Object.assign(payment, {
  //      id,
  //      amount: cieloPaymentDTO.payment.amount,
  //      seller: sellerId,
  //      customer: customerId,
  //      debitCard: card,
  //    });
  //
  //    payment = await this.paymentRepository.save(payment);
  //
  //    await this.updateWallet(cieloPaymentDTO.payment.amount, sellerId);
  //
  //    return payment;
  //  }

  async findPaymentById(id: string) {
    const payment = await this.paymentRepository.findOne(id);

    if (!payment) {
      throw new NotFoundException();
    }

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
