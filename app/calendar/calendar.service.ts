import {Http, Response, Headers} from "@angular/http";
import {Injectable, EventEmitter} from "@angular/core";
import {CalendarEvent} from "./event.class";
import {Court} from "../courts/court.class";
import {Instructor} from "../instructors/instructor.class";
import appGlobals = require('../app.global');
import {CourtType} from "../courts/court-type.class"; //<==== config

@Injectable()
export class CalendarService {

  events: CalendarEvent[] = [];
  eventsUpdated = new EventEmitter<CalendarEvent[]>();
  courts: Court[];
  courtsUpdated = new EventEmitter<Court[]>();
  instructors: Instructor[];
  instructorsUpdated = new EventEmitter<Instructor[]>();
  headers = new Headers({
    'Content-Type': 'application/json',
    'Authorization': localStorage.getItem('id_token')
  });
  courtTypes: CourtType[];
  courtTypesUpdated = new EventEmitter<CourtType[]>();


  constructor(private http: Http) {
  }

  fetchCourts() {
    return this.http.get(appGlobals.rest_server + 'courts', {headers: this.headers})
      .map((response: Response) => response.json())
      .subscribe(
        (data: Court[]) => {
          this.courts = data;
          this.courtsUpdated.emit(this.courts);
        }
      );
  }

  fetchCourtsByCourtTypeId(courtTypeId: number) {
    return this.http.get(appGlobals.rest_server + 'courts?court_type_id=' + courtTypeId, {headers: this.headers})
      .map((response: Response) => response.json())
      .subscribe(
        (data: Court[]) => {
          this.courts = data;
          this.courtsUpdated.emit(this.courts);
        }
      );
  }

  fetchInstructors() {
    return this.http.get(appGlobals.rest_server + 'instructors', {headers: this.headers})
      .map((response: Response) => response.json())
      .subscribe(
        (data: Instructor[]) => {
          this.instructors = data;
          this.instructorsUpdated.emit(this.instructors);
        }
      );
  }

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

  fetchEventsByCourtId(courtId: number, courtTypeId: number) {
    return this.http.get(appGlobals.rest_server + 'events?court_id=' + courtId + '&court_type_id=' + courtTypeId, {headers: this.headers})
      .map((response: Response) => response.json())
      .subscribe(
        (data: CalendarEvent[]) => {
          this.events = data;
          this.eventsUpdated.emit(this.events);
        }
      );
  }

  fetchEventsByInstructorId(instructorId: number, courtId: number, courtTypeId: number) {
    return this.http.get(appGlobals.rest_server + 'events?instructor_id=' + instructorId + '&court_id=' + courtId + '&court_type_id=' + courtTypeId, {headers: this.headers})
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
      'Content-Type': 'application/json'
    });
    return this.http.post(appGlobals.rest_server + 'events', body, {headers: this.headers})
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
      'Content-Type': 'application/json'
    });
    return this.http.put(appGlobals.rest_server + 'events', body, {headers: this.headers})
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
    this.http.delete(appGlobals.rest_server + 'events/' + event.id, {headers: this.headers}).subscribe((res) => {
      this.eventsUpdated.emit(this.events);
    });
  }

  fetchCourtTypes() {
    return this.http.get(appGlobals.rest_server + 'courtTypes', {headers: this.headers})
      .map((response: Response) => response.json())
      .subscribe(
        (data: CourtType[]) => {
          this.courtTypes = data;
          this.courtTypesUpdated.emit(this.courtTypes);
        }
      );
  }
}
