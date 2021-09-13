import { ApiProperty } from "@nestjs/swagger";


export class CreateDebitCardDTO {

  
  @ApiProperty({
    description: 'Nome do proprietario do cartão',
    example: 'Daniel de Souza Zamignani'
  })
  ownerName: string;

  @ApiProperty({
    description: 'Bandeira do cartão',
    example: 'Visa'
  })
  flag: string;

  @ApiProperty({
    description: 'Numero do cartão',
    example: '4929465240388137'
  })
  number: string;

  @ApiProperty({
    description: 'Validade do cartão',
    example: '13/06/2023'
  })
  validity: string;

  @ApiProperty({
    description: 'CVV do cartão',
    example: '123'
  })
  cvv: string;
}



