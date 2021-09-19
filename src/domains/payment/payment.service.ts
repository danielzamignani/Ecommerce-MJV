import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Payment } from './entities/payment.entity';
import * as uuid from 'uuid';
import { DebitCard } from './entities/debit-card.entity';
import { CreateDebitCardDTO } from './dto/create-debit-card.dto';
import { Wallet } from '../seller/entities/wallet.entity';
import { CreatePaymentDTO } from './dto/create-payment.dto';
import { Transaction } from './entities/transaction.entity';
import { webHook } from 'src/common/config/webhook.config';
import { CieloPostDTO } from './dto/cielo-post.dto';

@Injectable()
export class PaymentService {
  @InjectRepository(Payment)
  private readonly paymentRepository: Repository<Payment>;
  @InjectRepository(DebitCard)
  private readonly debitCardRepository: Repository<DebitCard>;
  @InjectRepository(Transaction)
  private readonly transactionRepository: Repository<Transaction>;
  @InjectRepository(Wallet)
  private readonly walletRepository: Repository<Wallet>;

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

    const cieloPostDTO: CieloPostDTO = {
      MerchantOrderId: orderId,
      Customer: {
        Name: payment.seller.name,
      },
      Payment: {
        Type: 'DebitCard',
        Authenticate: true,
        Amount: amount,
        ReturnUrl: webHook,
        DebitCard: {
          CardNumber: card.cardNumber,
          Holder: card.holder,
          ExpirationDate: card.expirationDate,
          SecurityCode: card.securityCode,
          Brand: card.brand,
        },
      },
    };

    return cieloPostDTO;
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

  async validatePayment(id: string) {
    /**MUDANDO STATUS DO PAYMENT*/
    let payment = await this.findPaymentById(id);
    payment.status = 'Approved';

    payment = await this.paymentRepository.save(payment);

    /**ADICIONAR VALOR A WALLET*/
    const sellerWallet = payment.seller.wallet;
    sellerWallet.amount += payment.amount;

    await this.walletRepository.save(sellerWallet);

    /**CRIAR TRANSACTION */

    await this.createTransaction(payment.amount, payment.orderId, sellerWallet);

    return payment;
  }

  async createTransaction(amount: number, orderId: string, wallet: Wallet) {
    const transaction = new Transaction();

    const id = uuid.v4();

    Object.assign(transaction, {
      id,
      amount,
      orderId,
      wallet,
    });

    this.transactionRepository.save(transaction);
  }

  async findPaymentById(id: string) {
    const payment = await this.paymentRepository.findOne(id);

    if (!payment) {
      throw new NotFoundException();
    }

    return payment;
  }
}
