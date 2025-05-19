import { RewardRequestLogStatus } from '../reward-request-log.schema';

export class GetMeRewardRequestsRequest {
  user_id: string;
  event_code?: string;
  status?: RewardRequestLogStatus;
}
