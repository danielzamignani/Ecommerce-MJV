import { Injectable } from '@nestjs/common';
import { CustomerService } from '../customer/customer.service';
import { SellerService } from '../seller/seller.service';

@Injectable()
export class AuthService {
  constructor(
      private customerService: CustomerService,
      private sellerService: SellerService
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
}
