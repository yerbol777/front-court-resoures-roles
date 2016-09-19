import {Component, OnInit, ChangeDetectorRef} from '@angular/core';
import {SelectItem} from 'primeng/primeng';
import {CalendarService} from "./calendar.service";
import {CalendarEvent} from "./event.class";
import {Court} from "../courts/court.class";
import {Instructor} from "../instructors/instructor.class";
declare var jQuery: any;

@Component({
    moduleId: module.id,
    selector: 'tsa-calendar',
    templateUrl: 'calendar.component.html'
})

export class CalendarComponent implements OnInit {
  events: CalendarEvent[] = [];
  fcEvents: any[] = [];
  header: any;
  event = {id: -1, start: '', end: '', title: '', instructor_id: -1, court_id: -1};
  dialogVisible: boolean = false;
  idGen: number = 100;
  courts: SelectItem[] = [];
  selectedCourt: Court;
  instructors: SelectItem[];
  selectedInstructor: Instructor;
  allDaySlot:boolean;
  locale: string;

  constructor(private cd: ChangeDetectorRef, private calendarService: CalendarService) {

  }

  handleDayClick(event: any) {
    this.event.title = '';
    var date = new Date(event.date.format());
    this.event.start = event.date.format().substr(0,16);
    var datePlusHour = new Date(date.setHours(date.getHours()+1));
    this.event.end = datePlusHour.toISOString().substr(0,16);
    this.dialogVisible = true;
    //trigger detection manually as somehow only moving the mouse quickly after click triggers the automatic detection
    //this.cd.detectChanges();
  }

  onCourtsDropdownChange() {
    this.event.court_id =  this.selectedCourt.id;
    if (this.selectedInstructor.id === -1) {
      this.calendarService.fetchEventsByCourtId(this.selectedCourt.id);
    } else {
      this.calendarService.fetchEventsByInstructorId(this.selectedInstructor.id, this.selectedCourt.id);
    }
  }

  onInstructorsDropdownChange() {
    this.event.instructor_id =  this.selectedInstructor.id;
    if (this.selectedInstructor.id === -1) {
      this.calendarService.fetchEventsByCourtId(this.selectedCourt.id);
    } else {
      this.calendarService.fetchEventsByInstructorId(this.selectedInstructor.id, this.selectedCourt.id);
    }
  }

  handleEventClick(e: any) {
    this.event.title = e.calEvent.title;
    let start = e.calEvent.start;
    let end = e.calEvent.end;
    this.event.id = e.calEvent.id;
    this.event.start = start.format().substr(0,16);
    this.event.end = end.format().substr(0,16);
    this.dialogVisible = true;
  }

  handleEventDrop(e: any) {
    this.event.title = e.event.title;
    let start = e.event.start;
    let end = e.event.end;
    this.event.id = e.event.id;
    this.event.start = start.format().substr(0,16);
    this.event.end = end.format().substr(0,16);
    this.saveEvent();
  }

  handleEventResize(e: any) {
    this.event.title = e.event.title;
    let start = e.event.start;
    let end = e.event.end;
    this.event.id = e.event.id;
    this.event.start = start.format().substr(0,16);
    this.event.end = end.format().substr(0,16);
    this.saveEvent();
  }

  saveEvent() {
    var calEvent = new CalendarEvent(-1,
      this.event.title,
      '',
      this.event.instructor_id,
      '',
      this.event.court_id,
      this.event.start,
      this.event.end);
    //update
    if(this.event.id !== -1) {
      calEvent.id = parseInt(this.event.id.toString());
      this.calendarService.editEvent(calEvent);
      this.clearEvent();
    }
    //new
    else {
      this.calendarService.addEvent(calEvent);
      this.clearEvent();
    }

    this.dialogVisible = false;
  }

  clearEvent() {
    this.event = {id: -1, start: '', end: '', title: '', instructor_id: -1, court_id: this.selectedCourt.id};
  }

  deleteEvent() {
    var calEvent = new CalendarEvent(parseInt(this.event.id.toString()),
      this.event.title,
      '',
      this.event.instructor_id,
      '',
      this.event.court_id,
      this.event.start,
      this.event.end);
    this.clearEvent();
    this.calendarService.deleteEvent(calEvent);
    this.dialogVisible = false;
  }

  findEventIndexById(id: number) {
    let index = -1;
    for(let i = 0; i < this.events.length; i++) {
      if(id == this.events[i].id) {
        index = i;
        break;
      }
    }

    return index;
  }

  ngOnInit() {
    this.calendarService.courtsUpdated.subscribe(
      (courts: Court[]) => {
        this.courts = [];
        for (var c of courts) {
          this.courts.push({label: c.name, value: c});
        }
        this.selectedCourt = this.courts[0].value;

        this.event.court_id =  this.selectedCourt.id;
        this.events = this.calendarService.getEvents();
        this.fcEvents = [];
        for (var ev of this.events) {
          this.fcEvents.push(this.toFCEvent(ev));
        }
        if (this.events.length === 0) {
          this.calendarService.fetchEventsByCourtId(this.selectedCourt.id);
        }
      }
    );

    this.calendarService.instructorsUpdated.subscribe(
      (instructors: Instructor[]) => {
        this.instructors = [{label: 'By Instructor', value: new Instructor(-1, 'By Instructor', '','','')}];
        for (var i of instructors) {
          this.instructors.push({label: i.name, value: i});
        }
        this.selectedInstructor = this.instructors[0].value;
        this.event.instructor_id =  this.selectedInstructor.id;
      }
    );

    this.calendarService.eventsUpdated.subscribe(
      (events: CalendarEvent[]) => {
        this.events = events;
        this.fcEvents = [];
        for (var ev of this.events) {
          this.fcEvents.push(this.toFCEvent(ev));
        }
      }
    );

    this.calendarService.fetchCourts();
    this.calendarService.fetchInstructors();

    this.header = {
      left   : 'prev,next today',
      center : 'title',
      right  : 'agendaDay, agendaWeek,'
    };

    this.allDaySlot = false;
    this.locale = 'ru';
  }

  toFCEvent(event: CalendarEvent) {
    return {"id": `${ event.id }`,
            "title": `${ event.title }`,
            "start": `${ event.start_datetime }`,
            "end": `${event.end_datetime}`
    };
  }
}
