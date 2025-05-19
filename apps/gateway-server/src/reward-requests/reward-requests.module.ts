import { Module } from '@nestjs/common';
import { RewardRequestsController } from './reward-requests.controller';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { RewardService } from '../reward/reward.service';

@Module({
  imports: [
    ClientsModule.registerAsync([
      {
        name: 'EVENT_SERVER',
        imports: [ConfigModule],
        inject: [ConfigService],
        useFactory: (configService: ConfigService) => ({
          transport: Transport.TCP,
          options: {
            host: configService.get<string>('EVENT_SERVER_HOST'),
            port: configService.get<number>('EVENT_SERVER_PORT'),
          },
        }),
      },
    ]),
  ],

  controllers: [RewardRequestsController],
  providers: [RewardService],
})
export class RewardRequestsModule {}
