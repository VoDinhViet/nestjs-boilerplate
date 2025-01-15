import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { CacheService } from './cache/cache.service';

@Controller()
export class AppController {
  constructor(
    private readonly cacheService: CacheService,
    private readonly appService: AppService,
  ) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Get('redis')
  async getRedis() {
    const cacheKey = 'sample-data';
    let data = await this.cacheService.get(cacheKey);

    if (!data) {
      // Simulate fetching data from an external API
      data = 'Sample data from external API';
      await this.cacheService.set(cacheKey, data, '1m'); // Cache for 1 minute
    }

    return {
      data,
      source: data === 'Sample data from external API' ? 'API' : 'Cache',
    };
  }
}
