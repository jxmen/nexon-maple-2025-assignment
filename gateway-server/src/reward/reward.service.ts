import {
  Inject,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { GetRewardsResponse } from './types/get-rewards.response';
import { ClientProxy } from '@nestjs/microservices';
import { catchError, firstValueFrom, throwError } from 'rxjs';

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

  private handleUnexpectedError(err) {
    return throwError(
      () => new InternalServerErrorException(err.message ?? 'Unexpected error'),
    );
  }
}
