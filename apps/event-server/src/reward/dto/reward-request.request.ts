import { IsNotEmpty, IsString } from 'class-validator';

export class RewardRequestRequest {
  @IsNotEmpty()
  @IsString()
  event_code: string;

  @IsNotEmpty()
  @IsString()
  user_id: string;
}
