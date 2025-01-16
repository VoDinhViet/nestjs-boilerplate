import { RedisConfig } from '../cache/config/redis-config.type';
import { AppConfig } from './app-config.type';

export type AllConfigType = {
  app: AppConfig;
  redis: RedisConfig;
};
