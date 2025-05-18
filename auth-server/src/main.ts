import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { ConsoleLogger } from '@nestjs/common';
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
        prefix: 'Auth',
        logLevels: ['debug', 'log', 'warn', 'error'],
      }),
      options: {
        // 컨테이너 외부에서 통신할 수 있도록 설정
        host: '0.0.0.0',
        port,
      },
    },
  );

  await app.listen();
}

bootstrap();
