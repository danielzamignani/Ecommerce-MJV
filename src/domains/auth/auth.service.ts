import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { Customer } from '../customer/entities/customer.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Seller } from '../seller/entities/seller.entity';
import { Repository } from 'typeorm';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(Customer)
    private readonly customerRepository: Repository<Customer>,
    @InjectRepository(Seller)
    private readonly sellerRepository: Repository<Seller>,
    private jwtService: JwtService,
  ) {}

  async validateCustomer(email: string, password: string): Promise<any> {
    const customer = await this.customerRepository.findOne({
      where: { email: email },
    });

    if (!customer) {
      throw new UnauthorizedException('Email or Password incorrect');
    }

    const isMatchCustomer = await bcrypt.compare(password, customer.password);
    if (isMatchCustomer) {
      const { password, ...result } = customer;
      return result;
    }

    throw new UnauthorizedException('Email or Password incorrect');
  }

  async validateSeller(email: string, password: string): Promise<any> {
    const seller = await this.sellerRepository.findOne({
      where: { email: email },
    });

    if (!seller) {
      throw new UnauthorizedException('Email or Password incorrect');
    }

    const isMatchSeller = await bcrypt.compare(password, seller.password);
    if (isMatchSeller) {
      const { password, ...result } = seller;
      return result;
    }

    throw new UnauthorizedException('Email or Password incorrect');
  }

  async login(user: any) {
    const payload = {
      email: user.email,
      id: user.id,
      accountType: user.accountType,
    };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}
