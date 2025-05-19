import { IsEnum, IsOptional, IsString } from 'class-validator';
import { RewardRequestLogStatus } from '../reward-request-log.schema';

export class GetMeRewardRequestsRequest {
  @IsString()
  user_id: string;

  @IsOptional()
  @IsString()
  event_code?: string;

  @IsOptional()
  @IsEnum(RewardRequestLogStatus)
  status?: RewardRequestLogStatus;
}
