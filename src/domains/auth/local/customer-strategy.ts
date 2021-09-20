import { Strategy } from 'passport-local';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthService } from '../auth.service';

@Injectable()
export class CustomerStrategy extends PassportStrategy(
  Strategy,
  'customerStrategy',
) {
  constructor(private authService: AuthService) {
    super({
      usernameField: 'email',
      passwordField: 'password',
    });
  }

  async validate(email: string, password: string): Promise<any> {
    const customer = await this.authService.validateCustomer(email, password);

    if (!customer) {
      throw new UnauthorizedException();
    }
    return customer;
  }
}
