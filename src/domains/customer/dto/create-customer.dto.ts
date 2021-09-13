import { ApiProperty } from "@nestjs/swagger";

export class CreateCustomerDTO {
  @ApiProperty( {
    description: 'Nome do comprador',
    example: 'Daniel de Souza Zamignani'
  } )
  name: string;

  @ApiProperty( {
    description: 'Email do comprador',
    example: 'danielzamignani@email.com'
  } )
  email: string;

  @ApiProperty( {
    description: 'Senha para a conta',
    example: 'abcde12345'
  } )
  password: string;
}
