import { EventType } from './enum/event-type';
import { EventStatus } from './event.schema';

export class EventEntity {
  code: string;
  name: string;
  type: EventType;
  condition: Record<string, any> = {};
  start_date: Date;
  end_date: Date;
  status: EventStatus;
  createdAt: Date;
  updatedAt: Date;

  constructor(obj: Record<string, any>) {
    this.code = obj.code;
    this.name = obj.name;
    this.type = obj.type;
    this.condition = obj.condition ?? {};
    this.start_date = obj.start_date ? new Date(obj.start_date) : undefined;
    this.end_date = obj.end_date ? new Date(obj.end_date) : undefined;
    this.status = obj.status;
    this.createdAt = obj.createdAt ? new Date(obj.createdAt) : undefined;
    this.updatedAt = obj.updatedAt ? new Date(obj.updatedAt) : undefined;
  }

  isEnded(date: Date = new Date()): boolean {
    return date > this.end_date;
  }

  isStarted(date: Date = new Date()) {
    return date > this.start_date;
  }

  isActivate() {
    return this.status === 'activate';
  }

  isCheckInType() {
    return this.type === EventType.CHECK_IN;
  }
}
