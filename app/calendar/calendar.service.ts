import {Http, Response, Headers} from "@angular/http";
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

  addEvent(event: CalendarEvent) {
    const body = JSON.stringify(event);
    const headers = new Headers({
      'Content-Type' : 'application/json'
    });
    return this.http.post('http://localhost:3003/events', body, {headers: headers})
      .map((response: Response) => response.json())
      .subscribe((data) => {
        event.id = data[0].id;
        this.events.push(event);
        this.eventsUpdated.emit(this.events);
      });
  }

  editEvent(event: CalendarEvent) {
    var index: number = -1;
    for (var i = 0; i < this.events.length; i++) {
      if (this.events[i].id === event.id) {
        index = i;
        break;
      }
    }
    this.events[index] = event;

    const body = JSON.stringify(event);
    const headers = new Headers({
      'Content-Type' : 'application/json'
    });
    return this.http.put('http://localhost:3003/events', body, {headers: headers})
      .subscribe((res) => {
        this.eventsUpdated.emit(this.events);
      });
  }

  deleteEvent(event: CalendarEvent) {
    var index: number = -1;
    for (var i = 0; i < this.events.length; i++) {
      if (this.events[i].id === event.id) {
        index = i;
        break;
      }
    }
    this.events.splice(index, 1);
    this.http.delete('http://localhost:3003/events/' + event.id).subscribe((res) => {
      this.eventsUpdated.emit(this.events);
    });
  }
}
