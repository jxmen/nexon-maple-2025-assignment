import { Module } from '@nestjs/common';
import { RewardController } from './reward.controller';
import { RewardService } from './reward.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Reward, RewardSchema } from './reward.schema';
import { Event, EventSchema } from '../event/event.schema';

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
    ]),
  ],
  controllers: [RewardController],
  providers: [RewardService],
})
export class RewardModule {}
