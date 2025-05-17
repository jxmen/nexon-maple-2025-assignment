import { Event, EventStatus } from '../event.schema';
import { EventType } from '../create-event.request';

export class GetEventDetailResponse {
  name: string;
  code: string;
  type: EventType;
  condition: Record<string, any>;
  status: EventStatus;
  start_date: Date;
  end_date: Date;

  constructor(event: Event) {
    this.name = event.name;
    this.code = event.code;
    this.type = event.type;
    this.condition = event.condition;
    this.status = event.status;
    this.start_date = event.start_date;
    this.end_date = event.end_date;
  }
}
