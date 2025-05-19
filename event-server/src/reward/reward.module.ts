import { Module } from '@nestjs/common';
import { RewardController } from './reward.controller';
import { RewardService } from './reward.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Reward, RewardSchema } from './reward.schema';
import { Event, EventSchema } from '../event/event.schema';
import {
  RewardRequestLog,
  RewardRequestLogSchema,
} from './reward-request-log.schema';
import { EventValidator } from '../event/event.validator';
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
  controllers: [RewardController],
  providers: [
    RewardService,
    EventValidator,
    {
      provide: 'RewardRequestEventPublisher',
      useClass: NestRewardRequestEventPublisher,
    },
    RewardRequestEventLister,
  ],
})
export class RewardModule {}
