import { EventType } from '../enums/event-type';
import { EventStatus } from '../enums/event-status';

export type GetEventDetailResponse = {
  name: string;
  code: string;
  type: EventType;
  condition: Record<string, any>;
  status: EventStatus;
  start_date: Date;
  end_date: Date;
};