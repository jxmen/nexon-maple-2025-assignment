import { Event, EventStatus } from '../../src/event/event.schema';
import { EventType } from '../../src/event/enum/event-type';

export class TestEventBuilder {
  private readonly event: Partial<Event> = {};

  withEndDate(date: Date): this {
    this.event.end_date = date;
    return this;
  }

  withStartDate(date: Date) {
    this.event.start_date = date;
    return this;
  }

  withStatus(status: EventStatus) {
    this.event.status = status;
    return this;
  }

  withType(type: EventType) {
    this.event.type = type;
    return this;
  }

  build(): Event {
    return new Event({
      code: this.event.code ?? 'TEST_CODE',
      name: this.event.name ?? '테스트 이벤트',
      type: this.event.type ?? EventType.CHECK_IN,
      condition: this.event.condition ?? {},
      start_date: this.event.start_date ?? new Date(),
      end_date: this.event.end_date ?? new Date(),
      status: this.event.status ?? 'activate',
    });
  }
}
