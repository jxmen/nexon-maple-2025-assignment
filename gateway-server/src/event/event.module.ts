import { Module } from '@nestjs/common';
import { EventController } from './event.controller';
import { EventService } from './event.service';
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
  controllers: [EventController],
  providers: [EventService],
})
export class EventModule {}
