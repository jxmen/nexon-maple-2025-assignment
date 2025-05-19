import { EventEntity } from './event.entity';

class EventStatusValidateError extends Error {
  constructor(
    public readonly code: string,
    message: string,
  ) {
    super(message);
    this.name = 'EventValidationError';
  }
}

export class EventStatusValidator {
  private readonly event: EventEntity;

  constructor(event: EventEntity) {
    this.event = event;
  }

  /**
   * 이벤트가 보상을 지급할 수 있는 상태인지 검증합니다. 아닐 경우 예외를 던집니다.
   * @param event
   */
  async validateRewardClaimable() {
    if (this.event.isEnded()) {
      throw new EventStatusValidateError('EVENT_ENDED', '종료된 이벤트입니다.');
    }

    if (!this.event.isStarted()) {
      throw new EventStatusValidateError(
        'EVENT_NOT_STARTED',
        '이벤트가 아직 시작되지 않았습니다.',
      );
    }

    if (!this.event.isActivate()) {
      throw new EventStatusValidateError(
        'EVENT_NOT_ACTIVATED',
        '이벤트가 아직 활성화되지 않았습니다.',
      );
    }
  }
}
