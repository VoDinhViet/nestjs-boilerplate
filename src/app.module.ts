import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import 'dotenv/config';
import { AuthModule } from './api/auth/auth.module';
import authConfig from './api/auth/config/auth.config';
import { HealthModule } from './api/health/health.module';
import { UsersModule } from './api/users/users.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CacheModule } from './cache/cache.module';
import redisConfig from './cache/config/redis.config';
import appConfig from './config/app.config';
import { DatabaseModule } from './database/database.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: ['.env', `.env.${process.env.NODE_ENV}`],
      load: [appConfig, redisConfig, authConfig],
      isGlobal: true,
    }),
    DatabaseModule,
    HealthModule,
    CacheModule,
    UsersModule,
    AuthModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
