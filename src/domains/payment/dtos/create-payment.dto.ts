import { ApiProperty } from '@nestjs/swagger';
import { CreateDebitCardDTO } from './create-debit-card.dto';

export class CreatePaymentDTO {
  @ApiProperty({
    description: 'Customer name',
    example: 'Vinicius Anderson da Conceição',
  })
  customerName: string;

  @ApiProperty({
    description: 'Payment amount',
    example: 100.0,
  })
  amount: number;

  @ApiProperty({
    description: "Seller's ID",
    example: 'f147c144-1692-4a77-adcf-f03b29a0b5ee',
  })
  sellerId: string;

  @ApiProperty({
    description: 'Debit Card',
    example: {
      holder: 'Vinicius Anderson da Conceição',
      brand: 'Visa',
      cardNumber: '4929465240388137',
      expirationDate: '06/2023',
      securityCode: '123',
    },
  })
  debitCard: CreateDebitCardDTO;
}
