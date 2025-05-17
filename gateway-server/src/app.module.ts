import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AuthModule } from './auth/auth.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  controllers: [AppController],
  imports: [
    AuthModule,
    ConfigModule.forRoot({
      isGlobal: true, // 전체 앱에서 ConfigService 사용 가능
      envFilePath: process.env.NODE_ENV === 'local' ? '.env.local' : '.env',
    }),
  ],
})
export class AppModule {}
