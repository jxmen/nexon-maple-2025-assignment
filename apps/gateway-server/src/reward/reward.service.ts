import {
  BadRequestException,
  Inject,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { GetRewardsResponse } from './dto/get-rewards.response';
import { ClientProxy } from '@nestjs/microservices';
import { catchError, firstValueFrom, throwError } from 'rxjs';
import { GetMeRewardRequestsResponse } from '../me/dto/get-me-reward-requests.response';
import { GetRewardRequestsQueryDto } from '../me/me.controller';
import { GetRewardRequestsResponse } from '../reward-requests/dto/get-reward-requests.response';

@Injectable()
export class RewardService {
  constructor(
    @Inject('EVENT_SERVER')
    private readonly eventServerClient: ClientProxy,
  ) {}

  async findAll(): Promise<GetRewardsResponse> {
    const pattern = 'get-rewards';

    return firstValueFrom(
      this.eventServerClient
        .send<GetRewardsResponse>(pattern, {})
        .pipe(catchError((err) => this.handleUnexpectedError(err))),
    );
  }

  async findAllMeRequests(
    userId: string,
    query: GetRewardRequestsQueryDto,
  ): Promise<GetMeRewardRequestsResponse> {
    const pattern = 'get-me-reward-requests';

    return firstValueFrom(
      this.eventServerClient
        .send<GetMeRewardRequestsResponse>(pattern, {
          // NOTE: 페이지네이션 추가 시 여기에 코드 추가
          user_id: userId,
          event_code: query.event_code,
          status: query.status,
        })
        .pipe(
          catchError((err) => {
            if (err.code === 'INVALID_INPUT') {
              throw new BadRequestException(err.message());
            }

            return this.handleUnexpectedError(err);
          }),
        ),
    );
  }

  async findAllRequests(query: GetRewardRequestsQueryDto) {
    const pattern = 'get-reward-requests';

    return firstValueFrom(
      this.eventServerClient
        .send<GetRewardRequestsResponse>(pattern, {
          // NOTE: 페이지네이션 추가 시 여기에 코드 추가
          event_code: query.event_code,
          status: query.status,
        })
        .pipe(
          catchError((err) => {
            if (err.code === 'INVALID_INPUT') {
              throw new BadRequestException(err.message);
            }

            return this.handleUnexpectedError(err);
          }),
        ),
    );
  }

  private handleUnexpectedError(err) {
    return throwError(
      () => new InternalServerErrorException(err.message ?? 'Unexpected error'),
    );
  }
}
