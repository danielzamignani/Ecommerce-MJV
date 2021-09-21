import { ApiProperty } from '@nestjs/swagger';

export class CreateSellerDTO {
  @ApiProperty({
    description: "Seller's name",
    example: 'Diogo Renato Almada',
  })
  name: string;

  @ApiProperty({
    description: "Seller's email",
    example: 'diogorenato@gmail.com',
  })
  email: string;

  @ApiProperty({
    description: "Seller's password",
    example: 'abcde12345',
  })
  password: string;
}
