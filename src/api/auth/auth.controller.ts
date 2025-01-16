import { AuthService } from '@/api/auth/auth.service';
import { LoginReqDto } from '@/api/auth/dto/login.req.dto';
import { LoginResDto } from '@/api/auth/dto/login.res.dto';
import { Body, Controller, Post } from '@nestjs/common';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('email/login')
  async signIn(@Body() reqDto: LoginReqDto): Promise<LoginResDto> {
    return await this.authService.signIn(reqDto);
  }
}
