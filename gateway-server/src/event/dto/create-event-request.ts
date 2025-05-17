export class CreateEventRequest {
  name: string;
  code: string;
  type: 'check-in';
  condition: Record<string, any>;
  start_date: Date;
  end_date: Date;
}
