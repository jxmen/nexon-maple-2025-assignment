import { Module } from '@nestjs/common';
import { RewardController } from './reward.controller';
import { RewardService } from './reward.service';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { ConfigModule, ConfigService } from '@nestjs/config';

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
  controllers: [RewardController],
  providers: [RewardService],
})
export class RewardModule {}
