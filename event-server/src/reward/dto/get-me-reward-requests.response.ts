import {
  RewardRequestLog,
  RewardRequestLogStatus,
} from '../reward-request-log.schema';

class RewardRequestDto {
  event_code: string;
  status: RewardRequestLogStatus;
  created_at: Date;

  constructor(it: RewardRequestLog) {
    this.event_code = it.event_code;
    this.status = it.status;
    this.created_at = it.createdAt;
  }
}

export class GetMeRewardRequestsResponse {
  user_id: string;
  requests: RewardRequestDto[];

  constructor(userId: string, rewardRequestLog: RewardRequestLog[]) {
    this.user_id = userId;
    this.requests = rewardRequestLog.map((it) => new RewardRequestDto(it));
  }
}
