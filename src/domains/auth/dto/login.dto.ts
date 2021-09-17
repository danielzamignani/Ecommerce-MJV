import { ApiProperty } from '@nestjs/swagger';

export class LoginDTO {
  @ApiProperty({
    description: 'Login Email',
    example: 'daniel@email.com',
  })
  email: string;

  @ApiProperty({
    description: 'Account Password',
    example: 'abcde12345',
  })
  password: string;
}
