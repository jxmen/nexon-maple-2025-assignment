import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConsoleLogger } from '@nestjs/common';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
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

  await app.listen();
}

bootstrap();
