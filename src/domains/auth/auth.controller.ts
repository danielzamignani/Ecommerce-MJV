import {
  Controller,
  Request,
  Post,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { LogHttpInterceptor } from 'src/shared/interceptors/loghttp.interceptor';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from './local/local-auth.guard';

@UseInterceptors(LogHttpInterceptor)
@ApiTags('Login')
@Controller('login')
export class AuthController {
  constructor(private authService: AuthService) {}

  @UseGuards(LocalAuthGuard)
  @Post()
  async login(@Request() req) {
    return this.authService.login(req.user);
  }
}
