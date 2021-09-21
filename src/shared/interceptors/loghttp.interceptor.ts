import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  Inject,
} from '@nestjs/common';
import { Channel } from 'amqplib';

import { Observable } from 'rxjs';
import { rabbitMqQueue } from '../configs/rabbitMq.config';
import { HttpLogDTO } from '../dtos/httplog.dto';

@Injectable()
export class LogHttpInterceptor implements NestInterceptor {
  constructor(
    @Inject('RABBIT_PUBLISH_CHANNEL')
    private readonly publishChannel: Channel,
  ) {}
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const method = context.switchToHttp().getRequest().method;
    const url = context.switchToHttp().getRequest().url;
    const headers = context.switchToHttp().getRequest().headers;
    const body = context.switchToHttp().getRequest().body;

    const httpLogDTO: HttpLogDTO = {
      url,
      method,
      headers,
      body,
    };

    this.publishChannel.sendToQueue(
      rabbitMqQueue,
      Buffer.from(JSON.stringify(httpLogDTO)),
      {
        persistent: true,
      },
    );

    return next.handle().pipe();
  }
}
