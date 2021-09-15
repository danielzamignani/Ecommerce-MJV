import { HttpException, HttpStatus } from '@nestjs/common';

export class EmailAlreadyInUse extends HttpException {
  constructor() {
    super('This email is already in use', HttpStatus.BAD_REQUEST);
  }
}
