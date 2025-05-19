import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConsoleLogger, ValidationPipe } from '@nestjs/common';
import {
  MicroserviceOptions,
  RpcException,
  Transport,
} from '@nestjs/microservices';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const appContext = await NestFactory.createApplicationContext(AppModule);
  const configService = appContext.get(ConfigService);
  const port = configService.get<number>('PORT');

  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    AppModule,
    {
      transport: Transport.TCP,
      logger: new ConsoleLogger({
        prefix: 'Event',
        logLevels: ['verbose', 'debug', 'log', 'warn', 'error'],
      }),
      options: {
        host: '0.0.0.0',
        port,
      },
    },
  );

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // DTO에 정의되지 않은 값은 제거
      forbidNonWhitelisted: true, // DTO에 정의되지 않은 값이 있으면 에러
      transform: true, // string → number, boolean, Date 등 타입 변환
      exceptionFactory: (errors) => {
        const messages = errors.map(
          (e) => `${e.property} - ${Object.values(e.constraints).join(', ')}`,
        );

        return new RpcException({
          code: 'INVALID_INPUT',
          message: messages,
        });
      },
    }),
  );

  await app.listen();
}

bootstrap();
