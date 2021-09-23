import {
  HttpException,
  Inject,
  Injectable,
  NotFoundException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Payment } from './entities/payment.entity';
import * as uuid from 'uuid';
import { DebitCard } from './entities/debit-card.entity';
import { CreateDebitCardDTO } from './dtos/create-debit-card.dto';
import { Wallet } from '../seller/entities/wallet.entity';
import { CreatePaymentDTO } from './dtos/create-payment.dto';
import { Transaction } from './entities/transaction.entity';
import { webHook } from 'src/shared/configs/webhook.config';
import { CieloPostDTO } from './dtos/cielo-post.dto';
import { Seller } from '../seller/entities/seller.entity';
import axios from 'axios';
import {
  cieloHeaderConfig,
  cieloURLGet,
  cieloURLPost,
} from 'src/shared/configs/cielo.config';
import { rabbitMqQueue } from 'src/shared/configs/rabbitMq.config';
import { Channel } from 'amqplib';
import { HttpLogDTO } from 'src/shared/dtos/httplog.dto';

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
  @InjectRepository(Seller)
  private readonly sellerRepository: Repository<Seller>;
  @Inject('RABBIT_PUBLISH_CHANNEL')
  private readonly publishChannel: Channel;
  async createPayment(
    { amount, debitCard, sellerId }: CreatePaymentDTO,
    customerId: string,
  ) {
    /**Verificando o vendedor */
    const seller = await this.sellerRepository.findOne(sellerId);

    if (!seller) {
      throw new NotFoundException('Seller Not Found!');
    }

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

    return await this.sendRequestCielo(payment);
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

  async sendRequestCielo(payment: Payment) {
    const cieloPostDTO: CieloPostDTO = {
      MerchantOrderId: payment.orderId,
      Customer: {
        Name: payment.customer.name,
      },
      Payment: {
        Type: 'DebitCard',
        Authenticate: true,
        Amount: payment.amount,
        ReturnUrl: webHook,
        DebitCard: {
          CardNumber: payment.debitCard.cardNumber,
          Holder: payment.debitCard.holder,
          ExpirationDate: payment.debitCard.expirationDate,
          SecurityCode: payment.debitCard.securityCode,
          Brand: payment.debitCard.brand,
        },
      },
    };

    console.log(cieloPostDTO);

    const response = await axios
      .post(cieloURLPost, cieloPostDTO, cieloHeaderConfig)
      .then(function (response) {
        return response;
      })
      .catch(function (error) {
        switch (error.response.data[0].Code) {
          case 126:
            throw new UnprocessableEntityException(
              'Debit Card Expiration Date is invalid',
            );
          case 146:
            throw new UnprocessableEntityException(
              'SecurityCode length exceeded',
            );
          case 300:
            throw new UnprocessableEntityException(
              'SecurityCode length must be longer than 2 characters',
            );
          default:
            throw new HttpException(
              error.response.data[0],
              error.response.status,
            );
        }
      });

    const httpLogDTO: HttpLogDTO = {
      url: cieloURLPost,
      method: 'POST',
      headers: cieloHeaderConfig,
      body: cieloPostDTO,
    };

    await this.publishChannel.sendToQueue(
      rabbitMqQueue,
      Buffer.from(JSON.stringify(httpLogDTO)),
      {
        persistent: true,
      },
    );

    return response.data;
  }

  async validatePayment(id: string) {
    const response = await axios
      .get(`${cieloURLGet}${id}`, cieloHeaderConfig)
      .then(function (response) {
        return response;
      })
      .catch(function (error) {
        throw new HttpException('Payment Not Found', error.response.status);
      });

    const httpLogDTO: HttpLogDTO = {
      url: cieloURLPost,
      method: 'GET',
      headers: cieloHeaderConfig,
      body: {},
    };

    this.publishChannel.sendToQueue(
      rabbitMqQueue,
      Buffer.from(JSON.stringify(httpLogDTO)),
      {
        persistent: true,
      },
    );

    const orderId = response.data.MerchantOrderId;

    console.log(orderId);

    if (response.data.Payment.Status === 2) {
      return await this.approvePayment(orderId);
    }
    return await this.refusePayment(orderId);
  }

  async approvePayment(id: string) {
    /**Mudando o status do pagamento*/
    console.log(id);
    let payment = await this.paymentRepository.findOne(id);
    payment.status = 'Approved';

    payment = await this.paymentRepository.save(payment);

    /**Adicionando valor a carteira*/
    const sellerWallet = payment.seller.wallet;
    sellerWallet.amount += payment.amount;

    await this.walletRepository.save(sellerWallet);

    /**Salvando a transação*/

    await this.createTransaction(payment.amount, payment.orderId, sellerWallet);

    const { customer, seller, debitCard, ...paymentReturn } = payment;

    console.log(payment);

    return paymentReturn;
  }

  async refusePayment(id: string) {
    console.log(id);
    let payment = await this.paymentRepository.findOne(id);
    payment.status = 'Refused';

    payment = await this.paymentRepository.save(payment);

    const { customer, seller, debitCard, ...paymentReturn } = payment;

    return paymentReturn;
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
}
