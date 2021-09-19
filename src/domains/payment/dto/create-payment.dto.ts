import { ApiProperty } from '@nestjs/swagger';

export class CreatePaymentDTO {
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
  debitCard: {
    holder: string;
    brand: string;
    cardNumber: string;
    expirationDate: string;
    securityCode: string;
  };
}
