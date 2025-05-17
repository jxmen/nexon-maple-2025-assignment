export class CreateEventRequest {
  name: string;
  code: string;
  type: 'check-in';
  condition: object;
  date: { start: Date; end: Date };
}

