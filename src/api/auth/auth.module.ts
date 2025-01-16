import { AuthController } from '@/api/auth/auth.controller';
import { AuthService } from '@/api/auth/auth.service';
import { UsersModule } from '@/api/users/users.module';
import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [UsersModule, JwtModule],
  controllers: [AuthController],
  providers: [AuthService],
})
export class AuthModule {}
