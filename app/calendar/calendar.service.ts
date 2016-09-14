import {Http, Response} from "@angular/http";
import {Injectable, EventEmitter} from "@angular/core";
import { CalendarEvent } from "./event.class";

@Injectable()
export class CalendarService {

  events: CalendarEvent[] = [];
  eventsUpdated = new EventEmitter<CalendarEvent[]>();
  constructor(private http: Http) {}

  getEvents() {
    return this.events;
  }

  getEventsByCourtId(courtId: number) {
    for (var event of this.events) {
      if (event.court_id === courtId) {
        return event;
      }
    }
    return null;
  }

  fetchEventsByCourtId(courtId: number) {
    return this.http.get('http://localhost:3003/events?court_id=' + courtId)
      .map((response: Response) => response.json())
      .subscribe(
        (data: CalendarEvent[]) => {
          this.events = data;
          this.eventsUpdated.emit(this.events);
        }
      );
  }

  fetchEventsByInstructorId(instructorId: number) {
    return this.http.get('http://localhost:3003/events?instructor_id=' + instructorId)
      .map((response: Response) => response.json())
      .subscribe(
        (data: CalendarEvent[]) => {
          this.events = data;
          this.eventsUpdated.emit(this.events);
        }
      );
  }
}
