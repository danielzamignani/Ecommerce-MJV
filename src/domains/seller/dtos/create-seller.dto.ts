import { ApiProperty } from '@nestjs/swagger';

export class CreateSellerDTO {
  @ApiProperty({
    description: 'Nome do vendedor',
    example: 'Daniel de Souza Zamignani',
  })
  name: string;

  @ApiProperty({
    description: 'Email do vendedor',
    example: 'danielzamignani@email.com',
  })
  email: string;

  @ApiProperty({
    description: 'Senha para a conta',
    example: 'abcde12345',
  })
  password: string;
}
