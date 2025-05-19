import { RewardRequestLogStatus } from '../reward-request-log.schema';

export class GetRewardRequestsRequest {
  event_code?: string;
  status?: RewardRequestLogStatus;
}
