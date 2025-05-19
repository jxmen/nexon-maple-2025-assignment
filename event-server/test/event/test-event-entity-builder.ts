import { EventStatus } from '../../src/event/event.schema';
import { EventType } from '../../src/event/enum/event-type';
import { EventEntity } from '../../src/event/event.entity';

export class TestEventEntityBuilder {
  private readonly eventEntity: Partial<EventEntity> = {};

  withEndDate(date: Date): this {
    this.eventEntity.end_date = date;
    return this;
  }

  withStartDate(date: Date) {
    this.eventEntity.start_date = date;
    return this;
  }

  withStatus(status: EventStatus) {
    this.eventEntity.status = status;
    return this;
  }

  withType(type: EventType) {
    this.eventEntity.type = type;
    return this;
  }

  build(): EventEntity {
    return new EventEntity({
      code: this.eventEntity.code ?? 'TEST_CODE',
      name: this.eventEntity.name ?? '테스트 이벤트',
      type: this.eventEntity.type ?? EventType.CHECK_IN,
      condition: this.eventEntity.condition ?? {},
      start_date: this.eventEntity.start_date ?? new Date(),
      end_date: this.eventEntity.end_date ?? new Date(),
      status: this.eventEntity.status ?? 'activate',
    });
  }
}
