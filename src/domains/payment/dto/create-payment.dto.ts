import { ApiProperty } from '@nestjs/swagger';
import { Seller } from 'src/domains/seller/entities/seller.entity';

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
  seller: string;

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
