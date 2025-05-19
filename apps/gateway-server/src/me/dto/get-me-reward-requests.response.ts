import { RewardRequestLogStatus } from '../../reward/enum/reward-request-log-status';

export type GetMeRewardRequestsResponse = {
  user_id: string;
  requests: {
    event_code: string;
    status: RewardRequestLogStatus;
    created_at: Date;
  }[];
};
