import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AuthModule } from './auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import { EventModule } from './event/event.module';
import { RewardModule } from './reward/reward.module';
import { MeModule } from './me/me.module';
import { RewardRequestsModule } from './reward-requests/reward-requests.module';

@Module({
  controllers: [AppController],
  imports: [
    AuthModule,
    ConfigModule.forRoot({
      isGlobal: true, // 전체 앱에서 ConfigService 사용 가능
      envFilePath: process.env.NODE_ENV === 'local' ? '.env.local' : '.env',
    }),
    EventModule,
    RewardModule,
    MeModule,
    RewardRequestsModule,
  ],
})
export class AppModule {}
