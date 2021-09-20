import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import jwt_decode from 'jwt-decode';
import { AuthenticatedUser } from '../dtos/authenticatedUser.dto';

@Injectable()
export class SellerGuard implements CanActivate {
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const jwt = context
      .switchToHttp()
      .getRequest()
      .headers.authorization.replace('Bearer ', '');

    const decodeCustomer: AuthenticatedUser = jwt_decode(jwt);

    if (decodeCustomer.accountType === 'Seller') {
      return true;
    }

    throw new UnauthorizedException(
      'This function is restricted for your account type',
    );
  }
}
