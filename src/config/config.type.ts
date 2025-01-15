import { AppConfig } from './app-config.type';
import { RedisConfig } from '../cache/config/redis-config.type';

export type AllConfigType = {
  app: AppConfig;
  redis: RedisConfig;
};
