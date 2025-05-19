import {
  RewardRequestLog,
  RewardRequestLogStatus,
} from '../reward-request-log.schema';

export class GetRewardRequestsResponse {
  event_code: string;
  user_id: string;
  status: RewardRequestLogStatus;
  created_at: Date;

  constructor(it: RewardRequestLog) {
    this.event_code = it.event_code;
    this.user_id = it.user_id;
    this.status = it.status;
    this.created_at = it.createdAt;
  }
}
