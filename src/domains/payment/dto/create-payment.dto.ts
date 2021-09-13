import { ApiProperty } from "@nestjs/swagger";
import { Customer } from "src/domains/customer/entities/customer.entity";
import { Seller } from "src/domains/seller/entities/seller.entity";
import { DebitCard } from "../entities/debit-card.entity";
import { CreateDebitCardDTO } from "./create-debit-card.dto";

export class CreatePaymentDTO {

  
  @ApiProperty({
    description: 'Descrição do pagamento',
    example: 'Não definido ainda'
  })
  description: string;

  @ApiProperty({
    description: 'Valor do pagamento',
    example: 100.00
  })
  value: number;

  @ApiProperty({
    description: 'ID do comprador',
    example: 'f147c144-1692-4a77-adcf-f03b29a0b5ee'
  })
  customer: Customer;

  @ApiProperty({
    description: 'ID do vendedor',
    example: 'f147c144-1692-4a77-adcf-f03b29a0b5ee'
  })
  seller: Seller;

  debitCard: {
    ownerName: string;
    flag: string;
    number: string;
    validity: string; 
    cvv: string;
  }
  
}