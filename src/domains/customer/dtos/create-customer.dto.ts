import { ApiProperty } from '@nestjs/swagger';

export class CreateCustomerDTO {
  @ApiProperty({
    description: "Customer's name",
    example: 'Vinicius Anderson da Conceição',
  })
  name: string;

  @ApiProperty({
    description: "Customer's email",
    example: 'viniciusanderson@gmail.com',
  })
  email: string;

  @ApiProperty({
    description: "Customer's password",
    example: 'abcde12345',
  })
  password: string;
}
