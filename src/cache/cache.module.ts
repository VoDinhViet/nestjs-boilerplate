import { Global, Module } from '@nestjs/common';
import { Cacheable } from 'cacheable';
import { CacheService } from './cache.service';
import KeyvRedis from '@keyv/redis';
import { ConfigService } from '@nestjs/config';
import { AllConfigType } from '../config/config.type';

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
