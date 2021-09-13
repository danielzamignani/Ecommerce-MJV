import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { CreateCustomerDTO } from "./dto/create-customer.dto";
import { Customer } from "./entities/customer.entity";
import * as uuid from 'uuid';
import { Repository } from "typeorm";

@Injectable()
export class CustomerService {

  @InjectRepository(Customer)
  private readonly customerRepository: Repository<Customer>;
  
  async createCustomer({ name, email, password }: CreateCustomerDTO) {
    let customer = new Customer();

    const id = uuid.v4();

    Object.assign(customer,
    {
      id,
      name,
      email,
      password,  
    });

    customer = await this.customerRepository.save(customer); 
    
    return customer; 
    
  }

  async findCustomerById(id: string) {
      const customer = await this.customerRepository.findOne(id);

      return customer
  }

  async findCustomerByEmail(email: string) {
    const customer = await this.customerRepository.findOne({ where: { email: email } });

    return customer;
  }
}