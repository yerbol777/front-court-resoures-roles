export class CalendarEvent {
  constructor(public id: number,
              public title: string,
              public instructor: string,
              public instructor_id: number,
              public court: string,
              public court_id: number,
              public start_datetime: string,
              public end_datetime: string) {}
}
