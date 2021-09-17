import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CustomerService } from '../customer/customer.service';
import { SellerService } from '../seller/seller.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private customerService: CustomerService,
    private sellerService: SellerService,
    private jwtService: JwtService,
  ) {}

  async validateUser(email: string, password: string): Promise<any> {
    const customer = await this.customerService.findCustomerByEmail(email);
    const seller = await this.sellerService.findSellerByEmail(email);

    console.log(password);

    if (customer) {
      const isMatchCustomer = await bcrypt.compare(password, customer.password);
      if (isMatchCustomer) {
        const { password, ...result } = customer;
        return result;
      }
    }

    if (seller) {
      const isMatchSeller = await bcrypt.compare(password, seller.password);
      if (isMatchSeller) {
        const { password, ...result } = seller;
        return result;
      }
    }

    throw new HttpException(
      'Email or Password incorrect',
      HttpStatus.UNAUTHORIZED,
    );
  }

  async login(user: any) {
    const payload = { email: user.email, id: user.id };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}
