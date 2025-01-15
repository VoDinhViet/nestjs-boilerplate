import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import {
  HttpStatus,
  UnprocessableEntityException,
  ValidationError,
  ValidationPipe,
} from '@nestjs/common';
import { AllConfigType } from './config/config.type';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService<AllConfigType>);

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      errorHttpStatusCode: HttpStatus.UNPROCESSABLE_ENTITY,
      exceptionFactory: (errors: ValidationError[]) => {
        return new UnprocessableEntityException(errors);
      },
    }),
  );

  await app.listen(
    configService.getOrThrow('app.port', { infer: true }),
    () => {
      console.info(`
    ======================================================================================================
        Name: [${configService.getOrThrow('app.name', { infer: true })}] - Port: [${configService.getOrThrow('app.port', { infer: true })}] - Environment: [${configService.getOrThrow('app.nodeEnv', { infer: true })}]
    ======================================================================================================
  `);
    },
  );
}

void bootstrap();
