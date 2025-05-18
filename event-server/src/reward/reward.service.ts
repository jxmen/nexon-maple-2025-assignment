import { Injectable } from '@nestjs/common';
import { GetRewardsResponse } from './dto/get-rewards.response';
import { Reward } from '../event/reward.schema';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';

@Injectable()
export class RewardService {
  constructor(
    @InjectModel(Reward.name) private readonly rewardModel: Model<Reward>,
  ) {}

  async findAll(): Promise<GetRewardsResponse[]> {
    const rewards: Reward[] = await this.rewardModel.find({}).exec();

    return rewards.map((it) => new GetRewardsResponse(it));
  }
}
