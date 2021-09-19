import { ApiProperty } from '@nestjs/swagger';
import { CreateDebitCardDTO } from './create-debit-card.dto';

export class CreatePaymentDTO {
  @ApiProperty({
    description: 'Nome do comprador',
    example: 'Daniel Souza',
  })
  customerName: string;

  @ApiProperty({
    description: 'Valor do pagamento',
    example: 100.0,
  })
  amount: number;

  @ApiProperty({
    description: 'ID do vendedor',
    example: 'f147c144-1692-4a77-adcf-f03b29a0b5ee',
  })
  sellerId: string;

  @ApiProperty({
    description: 'Cartão de Debito',
    example: 'Infos do cartão',
  })
  debitCard: CreateDebitCardDTO;
}
