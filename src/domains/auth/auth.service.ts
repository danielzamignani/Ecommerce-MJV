import { Injectable } from '@nestjs/common';
import { CustomerService } from '../customer/customer.service';
import { SellerService } from '../seller/seller.service';
import { JwtService } from '@nestjs/jwt';

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

    if (customer && customer.password === password) {
      const { password, ...result } = customer;
      return result;
    } else if (seller && seller.password === password) {
      const { password, ...result } = seller;
      return result;
    }
    return null;
  }

  async login(user: any) {
    const payload = { email: user.email, id: user.id };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}
