import { ApiProperty } from '@nestjs/swagger';

export class LoginDTO {
  @ApiProperty({
    description: 'Login Email',
    example: 'viniciusanderson@gmail.com',
  })
  email: string;

  @ApiProperty({
    description: 'Account Password',
    example: 'abcde12345',
  })
  password: string;
}
