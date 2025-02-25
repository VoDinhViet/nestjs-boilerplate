import { registerAs } from '@nestjs/config';

import { RedisConfig } from '@/cache/config/redis-config.type';
import validateConfig from '@/utils/validate-config';
import {
  IsBoolean,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  Max,
  Min,
} from 'class-validator';

class EnvironmentVariablesValidator {
  @IsString()
  @IsNotEmpty()
  REDIS_HOST: string;

  @IsInt()
  @Min(0)
  @Max(65535)
  REDIS_PORT: number;

  @IsString()
  REDIS_USERNAME: string;

  @IsString()
  REDIS_PASSWORD: string;

  @IsBoolean()
  @IsOptional()
  REDIS_TLS_ENABLED: boolean;
}

export default registerAs<RedisConfig>('redis', () => {
  console.info(`
    ======================================================================================================
        Register RedisConfig from environment variables
    ======================================================================================================
  `);
  validateConfig(process.env, EnvironmentVariablesValidator);

  const redisUrl = `redis://${process.env.REDIS_USERNAME}:${process.env.REDIS_PASSWORD}@${process.env.REDIS_HOST}:${process.env.REDIS_PORT}`;
  return {
    host: process.env.REDIS_HOST,
    port: process.env.REDIS_PORT ? parseInt(process.env.REDIS_PORT, 10) : 6379,
    username: process.env.REDIS_USERNAME,
    password: process.env.REDIS_PASSWORD,
    url: redisUrl,
    tlsEnabled: process.env.REDIS_TLS_ENABLED === 'true',
  };
});
