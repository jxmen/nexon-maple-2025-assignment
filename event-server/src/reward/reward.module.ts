import { Module } from '@nestjs/common';
import { RewardController } from './reward.controller';
import { RewardService } from './reward.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Reward, RewardSchema } from '../event/reward.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
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
