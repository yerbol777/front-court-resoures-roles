import {Court} from "../courts/court.class";
export class CalendarEvent {
  constructor(public id: number,
              public title: string,
              public instructor: string,
              public instructor_id: number,
              public court: Court,
              public tab_court_id: number,
              public start_datetime: string,
              public end_datetime: string,
              public court_id: number,
              public color: string) {
  }
}
