import {Component, OnInit, ChangeDetectorRef} from '@angular/core';
import {SelectItem} from 'primeng/primeng';
import {CalendarService} from "./calendar.service";
import {CalendarEvent} from "./event.class";
import {Court} from "../courts/court.class";
import {Instructor} from "../instructors/instructor.class";
import {CourtType} from "../courts/court-type.class";
import {FormGroup, Validators, FormBuilder, FormControl} from "@angular/forms";

@Component({
  moduleId: module.id,
  selector: 'tsa-calendar',
  templateUrl: 'calendar.component.html'
})

export class CalendarComponent implements OnInit {
  eventForm: FormGroup;
  events: CalendarEvent[] = [];
  fcEvents: any[] = [];
  header: any;
  event = {id: -1, start: '', end: '', title: '', instructor_id: -1, tab_court_id: 0, court_id: -1};
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

  constructor(private cd: ChangeDetectorRef, private calendarService: CalendarService, private formBuilder: FormBuilder) {
  }

  handleDayClick(event: any) {
    console.log('tab_court_id' + this.event.tab_court_id);
    this.event.id = -1;
    this.event.title = '';
    var date = new Date(event.date.format());
    this.event.start = event.date.format().substr(0, 16).replace("T", " ");
    var datePlusHour = new Date(date.setHours(date.getHours() + 1));
    this.event.end = datePlusHour.toISOString().substr(0, 16).replace("T", " ");
    if (event.tab_court_id == 0 || event.tab_court_id == -1 || typeof(event.tab_court_id) == 'undefined') {
      this.event.court_id = -1;
    }
    else {
      this.event.court_id = event.tab_court_id;
    }
    console.log(this.courtsDialog);

    this.event.instructor_id = event.instructor_id;
    this.dialogVisible = true;
    //trigger detection manually as somehow only moving the mouse quickly after click triggers the automatic detection
    //this.cd.detectChanges();
  }

  onCourtsDropdownChange() {
    this.event.tab_court_id = this.selectedCourt.id;
    if (this.selectedInstructor.id === -1) {
      this.calendarService.fetchEventsByCourtId(this.selectedCourt.id, this.selectedCourtType);
    } else {
      this.calendarService.fetchEventsByInstructorId(this.selectedInstructor.id, this.selectedCourt.id, this.selectedCourtType);
    }
  }

  onCourtsTabViewChange(e) {
    var court = <HTMLInputElement>document.getElementsByName('withCourtIdHidden').item(e.index);
    this.selectedCourt.id = parseInt(court.value);
    this.event.tab_court_id = this.selectedCourt.id;
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
    this.calendarService.fetchCourtsByCourtTypeId(this.selectedCourtType);

    // refresh events
    this.selectedCourt.id = 0; // show all by default after filter
    this.event.tab_court_id = this.selectedCourt.id;
    if (this.selectedInstructor.id === -1) {
      this.calendarService.fetchEventsByCourtId(this.selectedCourt.id, this.selectedCourtType);
    } else {
      this.calendarService.fetchEventsByInstructorId(this.selectedInstructor.id, this.selectedCourt.id, this.selectedCourtType);
    }
  }

  onDialogInstructorsDropdownChange() {
    console.log('this.selectedInstructor.id' + this.instructorsDialog);
    this.event.instructor_id = this.selectedInstructor.id;
  }

  handleEventClick(e: any) {
    this.event.title = e.calEvent.title;
    let start = e.calEvent.start;
    let end = e.calEvent.end;
    this.event.id = e.calEvent.id;
    this.event.start = start.format().substr(0, 16).replace("T", " ");
    this.event.end = end.format().substr(0, 16).replace("T", " ");
    this.event.court_id = e.calEvent.court_id;
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
      this.selectedCourt,
      this.event.tab_court_id,
      this.event.start,
      this.event.end,
      this.event.court_id);
    //update
    if (this.event.id !== -1) {
      calEvent.id = parseInt(this.event.id.toString());
      calEvent.court_id = parseInt(this.event.court_id.toString());
      calEvent.instructor_id = parseInt(this.event.instructor_id.toString()) == null ? -1 : parseInt(this.event.instructor_id.toString());
      //calEvent.instructor_id = -1;
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
      instructor_id: this.event.instructor_id,
      court_id: -1,
      tab_court_id: this.event.tab_court_id
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
      this.event.court_id);
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
    const number = '^([0-9])';
    this.eventForm = this.formBuilder.group({
      title: ['', Validators.required],
      court: ['', Validators.required],
      start: ['', Validators.required],
      end: ['', Validators.required],
      instructorDialog: []
    });


    this.calendarService.courtsUpdated.subscribe(
      (courts: Court[]) => {
        //this.courts = [{label: 'Все', value: new Court(-1, 'Все', '', 0)}];
        this.courtsDialog.push({label: '-Выберите корт-', value: -1});
        for (var c of courts) {
          this.courts.push({label: c.name, value: c.id});
          this.courtsDialog.push({label: c.name, value: c.id});
        }
        this.selectedCourt = new Court(0, 'Все', '', 0);

        this.event.tab_court_id = this.selectedCourt.id;
        this.events = this.calendarService.getEvents();
        this.fcEvents = [];
        for (var ev of this.events) {
          this.fcEvents.push(this.toFCEvent(ev));
        }
        if (this.events.length === 0) {
          this.calendarService.fetchEventsByCourtId(this.selectedCourt.id, this.selectedCourtType);
        }
      }
    );

    this.calendarService.courtTypesUpdated.subscribe(
      (courtTypes: CourtType[])=> {
        this.courtTypes = [{label: 'Все типы', value: new CourtType(0, 'Все Типы')}];
        for (var ct of courtTypes) {
          this.courtTypes.push({label: ct.name, value: ct.id});
        }
      }
    );

    this.calendarService.instructorsUpdated.subscribe(
      (instructors: Instructor[]) => {
        this.instructors = [{label: 'Все Инструкторы', value: new Instructor(-1, 'By Instructor', '', '', '')}];
        this.instructorsDialog = [{label: 'Без Инструктора', value: new Instructor(-1, 'Без Инструктора', '', '', '')}];
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
      "tab_court_id": 0,
      "court_id": `${event.court_id}`,
      "instructor_id": `${event.instructor_id}`
    };
  }
}
