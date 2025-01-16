import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginReqDto } from './dto/login.req.dto';
import { LoginResDto } from './dto/login.res.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('email/login')
  async signIn(@Body() reqDto: LoginReqDto): Promise<LoginResDto> {
    return await this.authService.signIn(reqDto);
  }
}
