import {
  Controller,
  Request,
  Post,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import {
  ApiBody,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';

import { LoginResponseSchema } from 'src/schemas/loginResponse.schema';
import { LogHttpInterceptor } from 'src/shared/interceptors/loghttp.interceptor';
import { AuthService } from './auth.service';
import { LoginDTO } from './dtos/login.dto';

@UseInterceptors(LogHttpInterceptor)
@ApiTags('Login')
@Controller('login')
export class AuthController {
  constructor(private authService: AuthService) {}

  @UseGuards(AuthGuard('customerStrategy'))
  @ApiOperation({
    summary: "Customer's credentials verification",
    description: 'Verify the credentials and return the customer token',
  })
  @ApiBody({ type: LoginDTO })
  @ApiOkResponse({
    description: "Customer's credentials OK",
    schema: LoginResponseSchema,
  })
  @ApiUnauthorizedResponse({ description: 'Email or Password incorrect' })
  @Post('/customer')
  async loginCustomer(@Request() req: any) {
    return this.authService.login(req.user);
  }

  @UseGuards(AuthGuard('sellerStrategy'))
  @ApiOperation({
    summary: "Seller's credentials verification",
    description: 'Verify the credentials and return the seller token',
  })
  @ApiBody({ type: LoginDTO })
  @ApiOkResponse({
    description: "Seller's credentials OK",
    schema: LoginResponseSchema,
  })
  @ApiUnauthorizedResponse({ description: 'Email or Password incorrect' })
  @Post('/seller')
  async loginSeller(@Request() req: any) {
    return this.authService.login(req.user);
  }
}
