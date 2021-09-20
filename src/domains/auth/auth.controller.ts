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
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { LogHttpInterceptor } from 'src/shared/interceptors/loghttp.interceptor';
import { AuthService } from './auth.service';
import { LoginDTO } from './dtos/login.dto';

@UseInterceptors(LogHttpInterceptor)
@ApiTags('Login')
@Controller('login')
export class AuthController {
  constructor(private authService: AuthService) {}

  @UseGuards(AuthGuard('customerStrategy'))
  @ApiBody({ type: LoginDTO })
  @ApiOkResponse({ description: 'Login customer account' })
  @ApiUnauthorizedResponse({ description: 'Invalid credentials' })
  @Post('/customer')
  async loginCustomer(@Request() req: any) {
    return this.authService.login(req.user);
  }

  @UseGuards(AuthGuard('sellerStrategy'))
  @ApiBody({ type: LoginDTO })
  @ApiOkResponse({ description: 'Login seller account' })
  @ApiUnauthorizedResponse({ description: 'Invalid credentials' })
  @Post('/seller')
  async loginSeller(@Request() req: any) {
    return this.authService.login(req.user);
  }
}
