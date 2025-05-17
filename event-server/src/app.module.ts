import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true, // 전체 앱에서 ConfigService 사용 가능
      envFilePath: `.env.${process.env.NODE_ENV ?? 'local'}`,
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
