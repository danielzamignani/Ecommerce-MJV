import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import jwt_decode from 'jwt-decode';

export const DecodeJwt = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const jwt = ctx
      .switchToHttp()
      .getRequest()
      .headers.authorization.replace('Bearer ', '');
    const response = jwt_decode(jwt);
    return response;
  },
);
