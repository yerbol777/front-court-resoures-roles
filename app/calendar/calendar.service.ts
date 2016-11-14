import {Http, Response, Headers} from "@angular/http";
import {Injectable, EventEmitter} from "@angular/core";
import {CalendarEvent, EventResource} from "./event.class";
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
    return this.http.get(appGlobals.rest_server + 'courts?court_type_id=0&nocache=' + new Date().getTime(), {headers: this.headers})
      .map((response: Response) => response.json())
      .subscribe(
        (data: Court[]) => {
          this.courts = data;
          this.courtsUpdated.emit(this.courts);
        }
      );
  }

  fetchCourtsByCourtTypeId(courtTypeId: number) {
    return this.http.get(appGlobals.rest_server + 'courts?court_type_id=' + courtTypeId + '&nocache=' + new Date().getTime(), {headers: this.headers})
      .map((response: Response) => response.json())
      .subscribe(
        (data: Court[]) => {
          this.courts = data;
          this.courtsUpdated.emit(this.courts);
        }
      );
  }

  fetchInstructors() {
    return this.http.get(appGlobals.rest_server + 'instructors?nocache=' + new Date().getTime(), {headers: this.headers})
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

  getEventsByCourtId(tabCourtId: number) {
    for (var event of this.events) {
      if (event.tab_court_id === tabCourtId) {
        return event;
      }
    }
    return null;
  }

  fetchEventsByCourtId(courtId: number, courtTypeId: number) {
    return this.http.get(appGlobals.rest_server + 'events?court_id=' + courtId + '&court_type_id=' + courtTypeId + '&nocache=' + new Date().getTime(), {headers: this.headers})
      .map((response: Response) => response.json())
      .subscribe(
        (data: CalendarEvent[]) => {
          if (data != null && data.length > 0) {
            this.events = data;
            this.eventsUpdated.emit(this.events);
          }
          else {
            this.eventsUpdated.emit(this.events);
          }
        }
      );
  }

  fetchEventsByInstructorId(instructorId: number, courtId: number, courtTypeId: number) {
    return this.http.get(appGlobals.rest_server + 'events?instructor_id=' + instructorId + '&court_id=' + courtId + '&court_type_id=' + courtTypeId + '&nocache=' + new Date().getTime(), {headers: this.headers})
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
    return this.http.post(appGlobals.rest_server + 'events?nocache=' + new Date().getTime(), body, {headers: this.headers})
      .map((response: Response) => response.json())
      .subscribe((data) => {
          event.id = data[0].id;
          event.resourceId = data[0].resourceId;
          this.events.push(event);
          this.eventsUpdated.emit(this.events);
        },
        error => {
          alert("Запись не может быть забронирован");
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
    return this.http.put(appGlobals.rest_server + 'events?nocache=' + new Date().getTime(), body, {headers: this.headers})
      .subscribe((data) => {
          var res = JSON.stringify(data);
          if (res.indexOf("ERROR") != -1) {
            alert("Запись не может быть забронирован");
            this.eventsUpdated.unsubscribe();
          }
          else {
            this.events[index].resourceId = data.json().resourceId;
            this.eventsUpdated.emit(this.events);
          }
        },
        error => {
          alert("Запись не может быть забронирован");
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
    return this.http.get(appGlobals.rest_server + 'courtTypes?nocache=' + new Date().getTime(), {headers: this.headers})
      .map((response: Response) => response.json())
      .subscribe(
        (data: CourtType[]) => {
          this.courtTypes = data;
          this.courtTypesUpdated.emit(this.courtTypes);
        }
      );
  }
}
