import KeyvRedis from '@keyv/redis';
import { Global, Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Cacheable } from 'cacheable';
import { AllConfigType } from '../config/config.type';
import { CacheService } from './cache.service';

export const CACHE_INSTANCE = 'CACHE_INSTANCE';

@Global()
@Module({
  providers: [
    {
      provide: CACHE_INSTANCE,
      inject: [ConfigService],
      useFactory: async (configService: ConfigService<AllConfigType>) => {
        const secondary = new KeyvRedis(
          configService.get('redis.url', { infer: true }),
        );
        return new Cacheable({ secondary, ttl: '4h' });
      },
    },
    CacheService,
  ],
  exports: [CACHE_INSTANCE, CacheService],
})
export class CacheModule {}
