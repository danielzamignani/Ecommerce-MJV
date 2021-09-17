import {
  Controller,
  Request,
  Post,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import {
  ApiBody,
  ApiOkResponse,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { LogHttpInterceptor } from 'src/shared/interceptors/loghttp.interceptor';
import { AuthService } from './auth.service';
import { LoginDTO } from './dto/login.dto';
import { LocalAuthGuard } from './local/local-auth.guard';

@UseInterceptors(LogHttpInterceptor)
@ApiTags('Login')
@Controller('login')
export class AuthController {
  constructor(private authService: AuthService) {}

  @UseGuards(LocalAuthGuard)
  @ApiBody({ type: LoginDTO })
  @ApiOkResponse({ description: 'Login account' })
  @ApiUnauthorizedResponse({ description: 'Invalid credentials' })
  @Post()
  async login(@Request() req: any) {
    return this.authService.login(req.user);
  }
}
