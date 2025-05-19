import { Module } from '@nestjs/common';
import { EventController } from './event.controller';
import { EventService } from './event.service';
import { MongooseModule } from '@nestjs/mongoose';
import { EventSchema } from './event.schema';
import { Reward, RewardSchema } from '../reward/reward.schema';
import {
  RewardRequestLog,
  RewardRequestLogSchema,
} from '../reward/reward-request-log.schema';
import { EventValidator } from './event.validator';
import { NestRewardRequestEventPublisher } from './event/publisher/nest-reward-request-event-publisher';
import { RewardRequestEventLister } from './event/listener/reward-request-event.lister';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: Event.name,
        schema: EventSchema,
      },
      {
        name: Reward.name,
        schema: RewardSchema,
      },
      {
        name: RewardRequestLog.name,
        schema: RewardRequestLogSchema,
      },
    ]),
  ],
  controllers: [EventController],
  providers: [
    EventService,
    EventValidator,
    {
      provide: 'RewardRequestEventPublisher',
      useClass: NestRewardRequestEventPublisher,
    },
    RewardRequestEventLister,
  ],
})
export class EventModule {}
