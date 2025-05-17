type EventStatus = 'activate' | 'deactivate';
type EventType = 'check-in';

export type GetEventsResponse = {
  events: {
    name: string;
    code: string;
    type: EventType;
    condition: Record<string, any>;
    status: EventStatus;
    start_date: Date;
    end_date: Date;
  }[];
};
