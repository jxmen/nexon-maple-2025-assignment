export class RewardRequestFaildEvent {
  public readonly userId: string;
  public readonly eventCode: string;

  constructor(param: { eventCode: string; userId: string }) {
    const { eventCode, userId } = param;

    this.eventCode = eventCode;
    this.userId = userId;
  }
}
