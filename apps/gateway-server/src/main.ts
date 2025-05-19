import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { BadRequestException, ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);
  const port = configService.get<number>('PORT');

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // DTO에 정의되지 않은 값은 제거
      forbidNonWhitelisted: true, // DTO에 정의되지 않은 값이 있으면 에러
      transform: true, // string → number, boolean, Date 등 타입 변환
      exceptionFactory: (errors) => {
        const messages = errors.map(
          (e) => `${e.property} - ${Object.values(e.constraints).join(', ')}`,
        );

        return new BadRequestException(messages);
      },
    }),
  );
  await app.listen(port);
}
bootstrap();
