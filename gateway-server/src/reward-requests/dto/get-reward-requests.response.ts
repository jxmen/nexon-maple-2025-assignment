import { RewardRequestLogStatus } from '../../reward/enum/reward-request-log-status';

export type GetRewardRequestsResponse = {
  requests: {
    event_code: string;
    user_id: string;
    status: RewardRequestLogStatus;
    created_at: Date;
  }[];
};
