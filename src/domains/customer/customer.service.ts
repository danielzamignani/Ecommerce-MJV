import { ConflictException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateCustomerDTO } from './dtos/create-customer.dto';
import { Customer } from './entities/customer.entity';
import * as bcrypt from 'bcrypt';
import * as uuid from 'uuid';
import { Repository } from 'typeorm';
import { Payment } from '../payment/entities/payment.entity';

@Injectable()
export class CustomerService {
  @InjectRepository(Customer)
  private readonly customerRepository: Repository<Customer>;
  @InjectRepository(Payment)
  private readonly paymentRepository: Repository<Payment>;

  async createCustomer({ name, email, password }: CreateCustomerDTO) {
    const userAlreadyExists = await this.customerRepository.findOne({
      where: { email: email },
    });

    if (userAlreadyExists) {
      throw new ConflictException('This email is already in use');
    }

    const customer = new Customer();

    const saltOrRounds = 10;
    password = await bcrypt.hash(password, saltOrRounds);

    Object.assign(customer, {
      id: uuid.v4(),
      name,
      email,
      password,
    });

    await this.customerRepository.save(customer);
  }

  async findCustomerById(id: string) {
    const customer = await this.customerRepository.findOne(id);

    const { password, accountType, ...customerReturn } = customer;

    return customerReturn;
  }

  async findCustomerPayments(id: string) {
    const customer = await this.customerRepository.findOne(id);

    const payments = await this.paymentRepository.find({
      where: { customer: customer },
    });

    const paymentsReturn = payments.map(
      ({ seller, customer, ...paymentsReturn }) => paymentsReturn,
    );

    return paymentsReturn;
  }
}
