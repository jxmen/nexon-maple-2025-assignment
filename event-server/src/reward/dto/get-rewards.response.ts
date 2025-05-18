import { Reward } from '../../event/reward.schema';

export class GetRewardsResponse {
  constructor(reward: Reward) {
    this.items = Object.fromEntries(reward.items);
    this.event = {
      code: reward.event_code,
      name: reward.event_name,
    };
  }

  items: Record<string, number>;
  event: {
    code: string;
    name: string;
  };
}
