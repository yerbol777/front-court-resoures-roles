import {Component, OnInit, ChangeDetectorRef} from '@angular/core';
import {SelectItem} from 'primeng/primeng';
import {CalendarService} from "./calendar.service";
import {CalendarEvent} from "./event.class";
import {Court} from "../courts/court.class";
import {Instructor} from "../instructors/instructor.class";
import {CourtType} from "../courts/court-type.class";

@Component({
  moduleId: module.id,
  selector: 'tsa-calendar',
  templateUrl: 'calendar.component.html'
})

export class CalendarComponent implements OnInit {
  events: CalendarEvent[] = [];
  fcEvents: any[] = [];
  header: any;
  event = {id: -1, start: '', end: '', title: '', instructor_id: -1, court_id: -1, selected_court_id: -1};
  dialogVisible: boolean = false;
  idGen: number = 100;
  courts: SelectItem[] = [];
  courts2: SelectItem[] = [];
  selectedCourtObj: Court;
  instructors: SelectItem[];
  instructorsSelect: SelectItem[];
  selectedInstructor: Instructor;
  allDaySlot: boolean;
  locale: string;
  courtTypes: SelectItem[] = [];
  selectedCourtType: number = 0;

  constructor(private cd: ChangeDetectorRef, private calendarService: CalendarService) {
  }

  handleDayClick(event: any) {
    this.event.title = '';
    var date = new Date(event.date.format());
    this.event.start = event.date.format().substr(0, 16);
    var datePlusHour = new Date(date.setHours(date.getHours() + 1));
    this.event.end = datePlusHour.toISOString().substr(0, 16);
    this.dialogVisible = true;
    //trigger detection manually as somehow only moving the mouse quickly after click triggers the automatic detection
    //this.cd.detectChanges();
  }

  onCourtsDropdownChange() {
    this.event.court_id = this.selectedCourtObj.id;
    if (this.selectedInstructor.id === -1) {
      this.calendarService.fetchEventsByCourtId(this.selectedCourtObj.id, this.selectedCourtType);
    } else {
      this.calendarService.fetchEventsByInstructorId(this.selectedInstructor.id, this.selectedCourtObj.id, this.selectedCourtType);
    }
  }

  onCourtsTabViewChange(e) {
    var index = e.index;
    //console.log("e.index: " + index);
    //this.selectedCourtObj.id = e.index;
    this.selectedCourtObj.id = document.getElementsByName('withCourtIdHidden')[e.index].value;
    this.event.court_id = this.selectedCourtObj.id;
    if (this.selectedInstructor.id === -1) {
      this.calendarService.fetchEventsByCourtId(this.selectedCourtObj.id, this.selectedCourtType);
    } else {
      this.calendarService.fetchEventsByInstructorId(this.selectedInstructor.id, this.selectedCourtObj.id, this.selectedCourtType);
    }
  }

  onInstructorsDropdownChange() {
    this.event.instructor_id = this.selectedInstructor.id;
    if (this.selectedInstructor.id === -1) {
      this.calendarService.fetchEventsByCourtId(this.selectedCourtObj.id, this.selectedCourtType);
    } else {
      this.calendarService.fetchEventsByInstructorId(this.selectedInstructor.id, this.selectedCourtObj.id, this.selectedCourtType);
    }
  }

  onCourtTypesDropdownChange() {
    console.log(this.selectedCourtType);
    this.courts =[];
    this.calendarService.fetchCourtsByCourtTypeId(this.selectedCourtType);

    // refresh events
    this.selectedCourtObj.id = 0; // show all by default after filter
    this.event.court_id = this.selectedCourtObj.id;
    if (this.selectedInstructor.id === -1) {
      this.calendarService.fetchEventsByCourtId(this.selectedCourtObj.id, this.selectedCourtType);
    } else {
      this.calendarService.fetchEventsByInstructorId(this.selectedInstructor.id, this.selectedCourtObj.id, this.selectedCourtType);
    }
  }

  onWithInstructorsDropdownChange() {
    if (this.selectedInstructor.id === -1) {
      this.calendarService.fetchEventsByCourtId(this.selectedCourtObj.id, this.selectedCourtType);
    } else {
      this.calendarService.fetchEventsByInstructorId(this.selectedInstructor.id, this.selectedCourtObj.id, this.selectedCourtType);
    }
  }

  handleEventClick(e: any) {
    //console.log(e.calEvent);
    this.event.title = e.calEvent.title;
    let start = e.calEvent.start;
    let end = e.calEvent.end;
    this.event.id = e.calEvent.id;
    this.event.start = start.format().substr(0, 16);
    this.event.end = end.format().substr(0, 16);
    this.event.selected_court_id = e.calEvent.court_id;
    this.event.instructor_id = e.calEvent.instructor_id;
    this.dialogVisible = true;
  }

  handleEventDrop(e: any) {
    this.event.title = e.event.title;
    let start = e.event.start;
    let end = e.event.end;
    this.event.id = e.event.id;
    this.event.start = start.format().substr(0, 16);
    this.event.end = end.format().substr(0, 16);
    this.saveEvent();
  }

  handleEventResize(e: any) {
    this.event.title = e.event.title;
    let start = e.event.start;
    let end = e.event.end;
    this.event.id = e.event.id;
    this.event.start = start.format().substr(0, 16);
    this.event.end = end.format().substr(0, 16);
    this.saveEvent();
  }

  saveEvent() {

    var calEvent = new CalendarEvent(-1,
      this.event.title,
      '',
      this.event.instructor_id,
      this.selectedCourtObj,
      this.event.court_id,
      this.event.start,
      this.event.end,
      this.event.selected_court_id);
    //update
    if (this.event.id !== -1) {
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
    this.event = {
      id: -1,
      start: '',
      end: '',
      title: '',
      instructor_id: this.selectedInstructor.id,
      court_id: this.selectedCourtObj.id,
      selected_court_id: -1
    };
  }

  deleteEvent() {
    var calEvent = new CalendarEvent(parseInt(this.event.id.toString()),
      this.event.title,
      '',
      this.event.instructor_id,
      this.selectedCourtObj,
      this.event.court_id,
      this.event.start,
      this.event.end,
      this.event.selected_court_id);
    this.clearEvent();
    this.calendarService.deleteEvent(calEvent);
    this.dialogVisible = false;
  }

  findEventIndexById(id: number) {
    let index = -1;
    for (let i = 0; i < this.events.length; i++) {
      if (id == this.events[i].id) {
        index = i;
        break;
      }
    }

    return index;
  }

  ngOnInit() {
    this.calendarService.courtsUpdated.subscribe(
      (courts: Court[]) => {
        //this.courts = [{label: 'Все', value: new Court(-1, 'Все', '', 0)}];

        for (var c of courts) {
          this.courts.push({label: c.name, value: c.id});
        }

        this.courts2 = [{label: 'Все', value: new Court(0, 'Все', '', 0)}];
        this.selectedCourtObj = this.courts2[0].value;

        this.event.court_id = this.selectedCourtObj.id;
        this.events = this.calendarService.getEvents();
        this.fcEvents = [];
        for (var ev of this.events) {
          this.fcEvents.push(this.toFCEvent(ev));
        }
        if (this.events.length === 0) {
          this.calendarService.fetchEventsByCourtId(this.selectedCourtObj.id, this.selectedCourtType);
        }
      }
    );

    this.calendarService.courtTypesUpdated.subscribe(
      (courtTypes:CourtType[])=> {
        this.courtTypes = [{label: 'Все типы', value: new CourtType(0, 'Все Типы')}];
        for (var ct of courtTypes){
          this.courtTypes.push({label: ct.name, value: ct.id});
        }
      }
    );

    this.calendarService.instructorsUpdated.subscribe(
      (instructors: Instructor[]) => {
        this.instructors = [{label: 'Все Инструкторы', value: new Instructor(-1, 'By Instructor', '', '', '')}];
        this.instructorsSelect = [{label: 'Без Инструктора', value: new Instructor(-1, 'Без Инструктора', '', '', '')}];
        for (var i of instructors) {
          this.instructors.push({label: i.name, value: i});
          this.instructorsSelect.push({label: i.name, value: i.id});
        }
        this.selectedInstructor = this.instructors[0].value;
        this.event.instructor_id = this.selectedInstructor.id;
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
    this.calendarService.fetchCourtTypes();

    this.header = {
      left: 'prev,next today',
      center: 'title',
      right: 'agendaDay, agendaWeek,'
    };

    this.allDaySlot = false;
    this.locale = 'ru';
  }

  toFCEvent(event: CalendarEvent) {
    return {
      "id": `${ event.id }`,
      "title": `${ event.title }`,
      "start": `${ event.start_datetime }`,
      "end": `${event.end_datetime}`,
      "court_id": `${event.court_id}`,
      "selected_court_id": `${event.selected_court_id}`,
      "instructor_id": `${event.instructor_id}`
    };
  }
}
