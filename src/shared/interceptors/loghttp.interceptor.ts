import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  Inject,
} from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { Observable } from 'rxjs';

@Injectable()
export class LogHttpInterceptor implements NestInterceptor {
  constructor(
    @Inject('LOGHTTP-SERVICE')
    private logHttpService: ClientProxy,
  ) {}
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const method = context.switchToHttp().getRequest().method;
    const url = context.switchToHttp().getRequest().url;
    const hearders = context.switchToHttp().getRequest().headers;
    const body = context.switchToHttp().getRequest().body;

    const logMessage = {
      url,
      method,
      hearders,
      body,
      dateHour: Date.now(),
    };

    this.logHttpService.emit({ cmd: 'log' }, logMessage);
    console.log(logMessage);

    return next.handle().pipe();
  }
}
