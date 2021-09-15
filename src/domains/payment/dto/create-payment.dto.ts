import { ApiProperty } from '@nestjs/swagger';
import { Customer } from 'src/domains/customer/entities/customer.entity';
import { Seller } from 'src/domains/seller/entities/seller.entity';

export class CreatePaymentDTO {
  @ApiProperty({
    description: 'Valor do pagamento',
    example: 100.0,
  })
  amount: number;

  @ApiProperty({
    description: 'ID do comprador',
    example: 'f147c144-1692-4a77-adcf-f03b29a0b5ee',
  })
  customer: Customer;

  @ApiProperty({
    description: 'ID do vendedor',
    example: 'f147c144-1692-4a77-adcf-f03b29a0b5ee',
  })
  seller: Seller;

  debitCard: {
    holder: string;
    brand: string;
    cardNumber: string;
    expirationDate: string;
    securityCode: string;
  };
}
