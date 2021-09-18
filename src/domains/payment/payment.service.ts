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
import { Transaction } from './entities/transaction.entity';

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
  @InjectRepository(Transaction)
  private readonly transactionRepository: Repository<Transaction>;

  async createPayment(
    { amount, debitCard, sellerId }: CreatePaymentDTO,
    customerId: string,
  ) {
    let payment = new Payment();

    const card = await this.createDebitCard(debitCard);

    const orderId = uuid.v4();

    Object.assign(payment, {
      orderId,
      amount,
      seller: sellerId,
      customer: customerId,
      debitCard: card,
    });

    payment = await this.paymentRepository.save(payment);

    const cieloRequest = {
      MerchantOrderId: orderId,
      Customer: {
        Name: 'Test',
      },
      Payment: {
        Type: 'DebitCard',
        Authenticate: true,
        Amount: amount,
        ReturnUrl: 'http://api.webhookinbox.com/i/1i5Y6dOc/in/',
        DebitCard: {
          CardNumber: card.cardNumber,
          Holder: card.holder,
          ExpirationDate: card.expirationDate,
          SecurityCode: card.securityCode,
          Brand: card.brand,
        },
      },
    };

    return cieloRequest;
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

  // async validatePayment(id: string) {
  //   const payment = await this.findPaymentById(id);
  //   payment.status = 'APROVED';
  //
  //   this.paymentRepository.update({ id: id }, update);
  // }

  //  async updateWallet(amount: number, sellerId: string, paymentId: string) {
  //    let transaction = new Transaction();
  //
  //    const id = uuid.v4();
  //    Object.assign(transaction, {
  //      id,
  //      amount,
  //      paymentId,
  //    });
  //
  //    transaction = await this.transactionRepository.save(transaction);
  //
  //    const seller = await this.sellerRepository.findOne(sellerId);
  //    const wallet = await this.walletRepository.findOne(seller.wallet.id);
  //    wallet.amount += amount;
  //
  //    await this.walletRepository.save(wallet);
  //  }
  //

  async findPaymentById(id: string) {
    const payment = await this.paymentRepository.findOne(id);

    if (!payment) {
      throw new NotFoundException();
    }

    return payment;
  }
}
