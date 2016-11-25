import {Component, OnInit, ChangeDetectorRef} from '@angular/core';
import {SelectItem} from 'primeng/primeng';
import {CalendarService} from "./calendar.service";
import {CalendarEvent, EventResource} from "./event.class";
import {Court} from "../courts/court.class";
import {Instructor} from "../instructors/instructor.class";
import {CourtType} from "../courts/court-type.class";
import {FormGroup, Validators, FormBuilder} from "@angular/forms";
import {Router} from "@angular/router";
///<reference path="typings/moment/moment.d.ts" />
var moment = require('moment');

@Component({
  moduleId: module.id,
  selector: 'tsa-calendar',
  templateUrl: 'calendar.component.html'
})

export class CalendarComponent implements OnInit {
  eventForm: FormGroup;
  fcResources: any[] = [];
  resources: any[] = [];  // resources clone
  events: CalendarEvent[];
  fcEvents: any[] = [];
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
  isInstructor: boolean = false;
  router: Router;

  constructor(private cd: ChangeDetectorRef,
              private calendarService: CalendarService,
              private formBuilder: FormBuilder,
              _router: Router) {
    this.router = _router;
    if (localStorage.getItem("role_code") == 'instructor') {
      this.isInstructor = true;
      this.router.navigate(['/calendar_instructor']);
    }
  }

  // handle new Event
  handleDayClick(event: any) {
    this.event.id = -1;
    this.event.title = '';
    var date = moment(event.date).format('YYYY-MM-DD HH:mm');
    this.event.start = event.date.format().substr(0, 16).replace("T", " ");
    var datePlusHour = moment(event.date).add(60, 'minutes');
    this.event.end = datePlusHour.format('YYYY-MM-DD HH:mm');
    this.event.court_id = event.resourceObj.id;
    this.event.resourceId = event.resourceObj.id;
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

  onCourtsDropdownChange() {
    this.event.tab_court_id = this.selectedCourt.id;
    if (this.selectedInstructor.id === -1 && this.selectedInstructor.id != null) {
      this.calendarService.fetchEventsByCourtId(this.selectedCourt.id, this.selectedCourtType);
    } else {
      this.calendarService.fetchEventsByInstructorId(this.selectedInstructor.id, this.selectedCourt.id, this.selectedCourtType);
    }
  }

  onCourtsTabViewChange(e) {
    var courtId = <HTMLInputElement>document.getElementsByName('withCourtIdHidden').item(e.index);
    var courtName = <HTMLInputElement>document.getElementsByName('withCourtNameHidden').item(e.index);
    this.selectedCourt.id = parseInt(courtId.value);
    this.event.tab_court_id = this.selectedCourt.id;
    if (parseInt(courtId.value) != -1) {
      this.courtsDialog = [({label: courtName.value, value: courtId.value})];
      this.event.court_id = parseInt(courtId.value);
      this.fcResources = [
        {
          id: courtId.value,
          title: courtName.value
        }];
    }
    else {
      this.courtsDialog.push({label: '-Выберите корт-', value: -1});
      this.courtsDialog = this.courts;
      this.fcResources = this.resources;
    }
    if (this.selectedInstructor.id === -1) {
      this.calendarService.fetchEventsByCourtId(this.selectedCourt.id, this.selectedCourtType);
    } else {
      this.calendarService.fetchEventsByInstructorId(this.selectedInstructor.id, this.selectedCourt.id, this.selectedCourtType);
    }
  }

  onInstructorsDropdownChange() {
    this.event.instructor_id = this.selectedInstructor.id;
    if (this.selectedInstructor.id === -1) {
      this.calendarService.fetchEventsByCourtId(this.selectedCourt.id, this.selectedCourtType);
    } else {
      this.calendarService.fetchEventsByInstructorId(this.selectedInstructor.id, this.selectedCourt.id, this.selectedCourtType);
    }
  }

  onCourtTypesDropdownChange() {
    this.courts = [];
    this.fcResources = [];
    this.resources = [];
    this.calendarService.fetchCourtsByCourtTypeId(this.selectedCourtType);

    // refresh events
    this.selectedCourt.id = 0; // show all by default after filter
    this.event.tab_court_id = this.selectedCourt.id;


    if (this.selectedInstructor.id !== -1) {
      this.calendarService.fetchEventsByInstructorId(this.selectedInstructor.id, this.selectedCourt.id, this.selectedCourtType);
    } else {
      //this.calendarService.fetchEventsByCourtId(this.selectedCourt.id, this.selectedCourtType);
    }
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
    this.event.resourceId = e.calEvent.resourceId;
    if (e.calEvent.instructor_id == null) {
      this.event.instructor_id = -1;
    }
    else {
      this.event.instructor_id = e.calEvent.instructor_id;
    }

    let dateNow = moment(new Date()).format('YYYY-MM-DD HH:mm');
    if (localStorage.getItem('role_code') == 'instructor'
      && e.calEvent.instructor_id == localStorage.getItem('instructor_id')) {
      this.dialogVisible = true;
    }
    else if (dateNow < startDate && localStorage.getItem('role_code') == 'operator') {
      this.dialogVisible = true;
    }
    else {
      alert("Hе возможно редактировать запись");
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

  handleEventResize(e: any) {
    this.event.title = e.event.title;
    let start = e.event.start;
    let end = e.event.end;
    this.event.id = e.event.id;
    this.event.court_id = e.event.court_id;
    this.event.start = start.format().substr(0, 16).replace("T", " ");
    this.event.end = end.format().substr(0, 16).replace("T", " ");
    this.event.resourceId = e.event.resourceId;
    let dateNow = new Date(moment.utc().utcOffset("+06:00"));
    if (dateNow < start) {
      this.saveEvent();
    }
    else {
      alert("Hе возможно редактировать запись старой даты");
    }
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
    if (localStorage.getItem('role_code') == 'instructor') {
      calEvent.instructor_id = localStorage.getItem('instructor_id');
    }

    var end = moment(this.event.end).format('YYYY-MM-DD HH:mm');
    if (end > start && dateNow < start) {
      //update
      if (this.event.id !== -1) {
        calEvent.id = parseInt(this.event.id.toString());
        calEvent.court_id = parseInt(this.event.court_id.toString());
        calEvent.instructor_id = this.event.instructor_id == null ? -1 : parseInt(this.event.instructor_id.toString());
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


    this.eventForm = this.formBuilder.group({
      title: ['', Validators.required],
      court: ['', Validators.required],
      start: ['', Validators.required],
      end: ['', Validators.required],
      instructorDialog: []
    });

    this.calendarService.fetchInstructors();
    this.calendarService.fetchCourtTypes();
    this.calendarService.fetchCourts();

    this.calendarService.courtsUpdated.subscribe(
      (courts: Court[]) => {
        this.courtsDialog = [];
        this.resources = [];
        this.fcResources = [];
        this.fcEvents = [];
        this.courts = [];

        for (var c of courts) {
          this.courts.push({label: c.name, value: c.id});
          this.resources.push(this.toFCResources(c));
          this.fcResources.push(this.toFCResources(c));
          this.courtsDialog.push({label: c.name, value: c.id});
        }
        this.selectedCourt = new Court(0, 'Все', '', 0, '');
        this.event.tab_court_id = this.selectedCourt.id;
        this.events = [];
        this.events = this.calendarService.getEvents();
        this.fcEvents = [];
        for (var ev of this.events) {
          this.fcEvents.push(this.toFCEvent(ev));
          if (localStorage.getItem("role_code") == 'instructor' && ev.instructor_id != localStorage.getItem("instructor_id")) {
            ev.color = 'gray';
          } else {
            ev.color = ev.color;
          }
        }
        if (this.events.length === 0) {
          this.calendarService.fetchEventsByCourtId(this.selectedCourt.id, this.selectedCourtType);
        }
      }
    );


    this.calendarService.courtTypesUpdated.subscribe(
      (courtTypes: CourtType[])=> {
        this.courtTypes = [{label: 'Все типы', value: 0}];
        for (var ct of courtTypes) {
          this.courtTypes.push({label: ct.name, value: ct.id});
        }
      }
    );

    this.calendarService.instructorsUpdated.subscribe(
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

    this.calendarService.eventsUpdated.subscribe(
      (events: CalendarEvent[]) => {
        this.events = events;
        this.fcEvents = [];
        if (this.events != null && this.events.length > 0) {
          for (var ev of this.events) {
            if (localStorage.getItem("role_code") == 'instructor' && ev.instructor_id != localStorage.getItem("instructor_id")) {
              ev.color = 'gray';
            }
            else {
              ev.color = ev.color;
            }
            this.fcEvents.push(this.toFCEvent(ev));
          }
        } else {
          this.fcEvents.push(null);
        }
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

  toFCResources(resource: EventResource) {
    return {
      "id": `${ resource.id }`,
      "title": `${ resource.title }`
    };
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
