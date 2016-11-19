import {Component, OnInit, ChangeDetectorRef} from '@angular/core';
import {SelectItem} from 'primeng/primeng';
import {CalendarInstructorService} from "./calendar_instructor.service";
import {CalendarEvent, EventResource} from "./event.class";
import {Court} from "../courts/court.class";
import {FormGroup, Validators, FormBuilder} from "@angular/forms";
import {Instructor} from "../instructors/instructor.class";
///<reference path="typings/moment/moment.d.ts" />
var moment = require('moment');

@Component({
  moduleId: module.id,
  selector: 'tsa-calendar',
  templateUrl: 'calendar_instructor.component.html'
})

export class CalendarInstructorComponent implements OnInit {
  eventForm: FormGroup;
  events: CalendarEvent[];
  fcEvents: any[] = [];
  fcResources: any[] = [];
  resources: any[] = [];  // resources clone
  header: any;
  event = {
    id: -1,
    start: '',
    end: '',
    title: '',
    instructor_id: -1,
    tab_court_id: 0,
    court_id: -1,
    color: '',
    resourceId: -1
  };
  dialogVisible: boolean = false;
  idGen: number = 100;
  courts: SelectItem[] = [];
  courtsDialog: SelectItem[] = [];
  selectedCourt: Court;
  instructors: SelectItem[];
  instructorsDialog: SelectItem[];
  selectedInstructor: Instructor;
  allDaySlot: boolean;
  locale: string;
  courtTypes: SelectItem[] = [];
  selectedCourtType: number = 0;

  constructor(private cd: ChangeDetectorRef, private calendarInstructorService: CalendarInstructorService, private formBuilder: FormBuilder) {
  }

  // handle new Event
  handleDayClick(event: any) {
    this.event.id = -1;
    this.event.title = '';
    var date = moment(event.date).format('YYYY-MM-DD HH:mm');
    this.event.start = event.date.format().substr(0, 16).replace("T", " ");
    var datePlusHour = moment(event.date).add(60, 'minutes');
    this.event.end = datePlusHour.format('YYYY-MM-DD HH:mm');
    var dateNow = moment(new Date()).format('YYYY-MM-DD HH:mm');
    this.event.instructor_id = event.instructor_id;
    if (dateNow < date) {
      this.dialogVisible = true;
    }
    else {
      alert("Hе возможно добавить запись к старой дате");
    }

    //trigger detection manually as somehow only moving the mouse quickly after click triggers the automatic detection
    //this.cd.detectChanges();
  }

  // handle Edit Event Click
  handleEventClick(e: any) {
    this.event.title = e.calEvent.title;
    let startDate = moment(e.calEvent.start).format('YYYY-MM-DD HH:mm');
    let start = e.calEvent.start;
    let end = e.calEvent.end;
    this.event.id = e.calEvent.id;
    this.event.start = start.format().substr(0, 16).replace("T", " ");
    this.event.end = end != null ? end.format().substr(0, 16).replace("T", " ") : null;
    this.event.court_id = e.calEvent.court_id;
    if (e.calEvent.instructor_id == null) {
      this.event.instructor_id = -1;
    }
    else {
      this.event.instructor_id = e.calEvent.instructor_id;
    }

    let dateNow = moment(new Date()).format('YYYY-MM-DD HH:mm');
    if (dateNow < startDate) {
      this.dialogVisible = true;
    }
    else {
      alert("Hе возможно редактировать запись старой даты");
    }
  }

  handleEventDrop(e: any) {
    this.event.title = e.event.title;
    let start = e.event.start;
    let end = e.event.end;
    this.event.id = e.event.id;
    this.event.start = start.format().substr(0, 16).replace("T", " ");
    this.event.end = end.format().substr(0, 16).replace("T", " ");
    this.event.court_id = e.event.court_id;
    this.event.resourceId = e.event.resourceId;
    this.saveEvent();
  }

  saveEvent() {

    var calEvent = new CalendarEvent(-1,
      this.event.title,
      '',
      this.event.instructor_id,
      this.selectedCourt,
      this.event.tab_court_id,
      this.event.start,
      this.event.end,
      this.event.court_id,
      this.event.color,
      this.event.resourceId
    );
    let dateNow = moment(new Date()).format('YYYY-MM-DD HH:mm');
    var start = moment(this.event.start).format('YYYY-MM-DD HH:mm');

    var end = moment(this.event.end).format('YYYY-MM-DD HH:mm');
    if (end > start && dateNow < start) {
      //update
      if (this.event.id !== -1) {
        calEvent.id = parseInt(this.event.id.toString());
        calEvent.court_id = parseInt(this.event.court_id.toString());
        calEvent.instructor_id = this.event.instructor_id == null ? -1 : parseInt(this.event.instructor_id.toString());
        this.calendarInstructorService.editEvent(calEvent);
        this.clearEvent();
      }
      //new
      else {
        this.calendarInstructorService.addEvent(calEvent);
        this.clearEvent();
      }
      this.dialogVisible = false;
    }
    else {
      alert('Hе возможно редактировать запись старой даты');
    }


  }

  clearEvent() {
    this.event = {
      id: -1,
      start: '',
      end: '',
      title: '',
      instructor_id: this.event.instructor_id,
      court_id: this.event.court_id,
      tab_court_id: this.event.tab_court_id,
      color: '',
      resourceId: this.event.resourceId
    };
  }

  deleteEvent() {
    var calEvent = new CalendarEvent(parseInt(this.event.id.toString()),
      this.event.title,
      '',
      this.event.instructor_id,
      this.selectedCourt,
      this.event.tab_court_id,
      this.event.start,
      this.event.end,
      this.event.court_id,
      this.event.color,
      this.event.resourceId);
    this.clearEvent();
    this.calendarInstructorService.deleteEvent(calEvent);
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

    this.eventForm = this.formBuilder.group({
      title: ['', Validators.required],
      court: ['', Validators.required],
      start: ['', Validators.required],
      end: ['', Validators.required],
      instructorDialog: []
    });

    this.calendarInstructorService.fetchInstructors();
    this.calendarInstructorService.fetchCourts();

    this.calendarInstructorService.fetchEventsByInstructorId(8, 0, 0);

    this.calendarInstructorService.eventsUpdated.subscribe(
      (events: CalendarEvent[]) => {
        this.events = events;
        this.fcEvents = [];
        if (this.events != null && this.events.length > 0) {


          for (var ev of this.events) {
            if (ev.instructor_id != localStorage.getItem("instructor_id")) {
              ev.color = "gray";
            }
            this.fcEvents.push(this.toFCEvent(ev));
          }
        } else {
          this.fcEvents.push(null);
        }
      }
    );

    this.calendarInstructorService.courtsUpdated.subscribe(
      (courts: Court[]) => {
        this.courtsDialog = [];
        this.resources = [];
        this.fcResources = [];
        this.fcEvents = [];

        for (var c of courts) {
          this.courts.push({label: c.name, value: c.id});
          this.courtsDialog.push({label: c.name, value: c.id});
        }
      }
    );

    this.calendarInstructorService.instructorsUpdated.subscribe(
      (instructors: Instructor[]) => {
        this.instructors = [{label: 'Все Инструкторы', value: new Instructor(-1, 'By Instructor', '', '', '')}];
        this.instructorsDialog = [{label: 'Без Инструктора', value: -1}];
        for (var i of instructors) {
          this.instructors.push({label: i.name, value: i});
          this.instructorsDialog.push({label: i.name, value: i.id});
        }
        this.selectedInstructor = this.instructors[0].value;
        this.event.instructor_id = this.selectedInstructor.id;
      }
    );

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
      "instructor_id": `${event.instructor_id}`,
      "color": `${event.color}`,
      "resourceId": `${event.resourceId}`
    };
  }

}
