import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateCustomerDTO } from './dto/create-customer.dto';
import { Customer } from './entities/customer.entity';
import * as bcrypt from 'bcrypt';
import * as uuid from 'uuid';
import { Repository } from 'typeorm';

@Injectable()
export class CustomerService {
  @InjectRepository(Customer)
  private readonly customerRepository: Repository<Customer>;

  async createCustomer({ name, email, password }: CreateCustomerDTO) {
    const userAlreadyExists = await this.findCustomerByEmail(email);

    if (userAlreadyExists) {
      throw new HttpException(
        'This email is already in use',
        HttpStatus.CONFLICT,
      );
    }

    let customer = new Customer();

    const saltOrRounds = 10;
    password = await bcrypt.hash(password, saltOrRounds);

    Object.assign(customer, {
      id: uuid.v4(),
      name,
      email,
      password,
    });

    customer = await this.customerRepository.save(customer);

    return customer;
  }

  async findCustomerProfile(id: string) {
    const customer = await this.customerRepository.findOne(id);

    return customer;
  }

  async findCustomerPayments(id: string) {
    const customer = await this.customerRepository.findOne(id);

    return customer.payments;
  }

  //Utilizado na criação do customer e na autenticaçao
  //Ambos já tem seus proprios tratamentos de erro
  async findCustomerByEmail(email: string) {
    const customer = await this.customerRepository.findOne({
      where: { email: email },
    });

    return customer;
  }
}
