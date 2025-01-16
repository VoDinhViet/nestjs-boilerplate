import { AuthService } from '@/api/auth/auth.service';
import { AllConfigType } from '@/config/config.type';
import { Environment } from '@/constants/app.constant';
import { AuthGuard } from '@/guards/auth.guard';
import setupSwagger from '@/utils/setup-swagger';
import {
  ClassSerializerInterceptor,
  HttpStatus,
  UnprocessableEntityException,
  ValidationError,
  ValidationPipe,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory, Reflector } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService<AllConfigType>);
  const reflector = app.get(Reflector);
  const isProduction =
    configService.get('app.nodeEnv', { infer: true }) ===
    Environment.PRODUCTION;

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

  app.useGlobalGuards(new AuthGuard(reflector, app.get(AuthService)));

  //************************************************************
  // Transform response to class instance
  //************************************************************

  app.useGlobalInterceptors(new ClassSerializerInterceptor(reflector));

  //************************************************************
  // [Enable/Disable] Swagger UI
  //************************************************************
  if (!isProduction) {
    setupSwagger(app);
  }

  await app.listen(
    configService.getOrThrow('app.port', { infer: true }),
    async () => {
      console.info(`
    ======================================================================================================
        Name: [${configService.getOrThrow('app.name', { infer: true })}] - Port: [${configService.getOrThrow('app.port', { infer: true })}] - Environment: [${configService.getOrThrow('app.nodeEnv', { infer: true })}]
        ${!isProduction ? `Swagger UI: ${(await app.getUrl()).replace(`[::1]`, `localhost`).trim()}/api-docs` : 'Swagger UI: Disabled'}
    ======================================================================================================
  `);
    },
  );
}

void bootstrap();
