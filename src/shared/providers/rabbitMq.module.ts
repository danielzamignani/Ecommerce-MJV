import { Module } from '@nestjs/common';
import { RabbitProvider } from './rabbitMq.provider';

@Module({
  providers: [...RabbitProvider],
  exports: [...RabbitProvider],
})
export class RabbitModule {}
