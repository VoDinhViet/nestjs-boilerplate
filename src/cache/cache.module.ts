import { Global, Module } from '@nestjs/common';
import { Cacheable } from 'cacheable';
import { CacheService } from './cache.service';
import KeyvRedis from '@keyv/redis';

export const CACHE_INSTANCE = 'CACHE_INSTANCE';

@Global()
@Module({
  providers: [
    {
      provide: CACHE_INSTANCE,
      useFactory: () => {
        const secondary = new KeyvRedis(
          'redis://default:YRe1C4DEdABp3GrT53NIy8UJzHfTJTHe@redis-12079.c252.ap-southeast-1-1.ec2.redns.redis-cloud.com:12079',
        );
        return new Cacheable({ secondary, ttl: '4h' });
      },
    },
    CacheService,
  ],
  exports: [CACHE_INSTANCE, CacheService],
})
export class CacheModule {}
