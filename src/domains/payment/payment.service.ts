import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Customer } from "../customer/entities/customer.entity";
import { CreatePaymentDTO } from "./dto/create-payment.dto";
import { Payment } from "./entities/payment.entity";
import * as uuid from 'uuid';
import { DebitCard } from "./entities/debit-card.entity";
import { CreateDebitCardDTO } from "./dto/create-debit-card.dto";

@Injectable()
export class PaymentService {

  @InjectRepository(Customer)
  private readonly customerRepository: Repository<Customer>;
  @InjectRepository(Payment)
  private readonly paymentRepository: Repository<Payment>;
  @InjectRepository(DebitCard)
  private readonly debitCardRepository: Repository<DebitCard>;


async createPayment(createPaymentDTO: CreatePaymentDTO) {
    let payment = new Payment();

    const cardInfo = createPaymentDTO.debitCard
    

    const card = await this.createDebitCard(cardInfo)
    
    const id = uuid.v4();

    Object.assign(payment,
    {
      id,  
      amount: createPaymentDTO.amount,
      customer: createPaymentDTO.customer,
      seller: createPaymentDTO.seller,
      debitCard: card
    });

    payment = await this.paymentRepository.save(payment);

    return payment 
    
  }

  async findPaymentById(id: string) {
    const payment = await this.paymentRepository.findOne(id)

    return payment;
  }

  async createDebitCard(cardInfo: CreateDebitCardDTO) {
    let card = new DebitCard();

    const id = uuid.v4();

    Object.assign(card,
        {
            id,  
            holder: cardInfo.holder,
            brand: cardInfo.brand,
            cardNumber: cardInfo.cardNumber,
            expirationDate: cardInfo.expirationDate,
            securityCode: cardInfo.securityCode,
        });

    card = await this.debitCardRepository.save(card)

    return card
  }

}

