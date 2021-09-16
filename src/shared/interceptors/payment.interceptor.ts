import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  HttpException,
} from '@nestjs/common';
import { Observable, catchError } from 'rxjs';

@Injectable()
export class PaymentInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const body = context.switchToHttp().getRequest().body;

    const cieloRequest = {
      merchantOrderId: 1,
      payment: {
        type: 'DebitCard',
        authenticate: false,
        amount: body.amount,
        debitCard: body.debitCard,
        isCryptoCurrencyNegotiation: true,
      },
    };

    JSON.stringify(cieloRequest);

    context.switchToHttp().getRequest().body = cieloRequest;

    return next.handle().pipe(
      catchError((error) => {
        throw new HttpException(error.response.data, error.response.status);
      }),
    );
  }
}
