import { AuthConfig } from '@/api/auth/config/auth-config.type';
import { RedisConfig } from '@/cache/config/redis-config.type';
import { AppConfig } from '@/config/app-config.type';

export type AllConfigType = {
  app: AppConfig;
  redis: RedisConfig;
  auth: AuthConfig;
};
