import { EventType } from '../enum/event-type';

export type CreateEventRequest = {
  name: string;
  code: string;
  type: EventType;
  condition: Record<string, any>;
  start_date: Date;
  end_date: Date;
};
