import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DatabaseModule } from './database/database.module';
import { ConfigModule } from '@nestjs/config';
import { HealthModule } from './api/health/health.module';
import { CacheModule } from './cache/cache.module';
import appConfig from './config/app.config';
import 'dotenv/config';
@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: ['.env', `.env.${process.env.NODE_ENV}`],
      load: [appConfig],
      isGlobal: true,
    }),
    DatabaseModule,
    HealthModule,
    CacheModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
