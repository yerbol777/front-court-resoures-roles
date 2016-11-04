import {Component, OnInit, ChangeDetectorRef} from '@angular/core';
import {SelectItem} from 'primeng/primeng';
import {CalendarService} from "./calendar.service";
import {CalendarEvent, EventResource} from "./event.class";
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
  resources: any[] = [];
  fcEvents: any[] = [];
  fcResources: any[] = [];
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

  constructor(private cd: ChangeDetectorRef, private calendarService: CalendarService, private formBuilder: FormBuilder) {
  }

  // handle new Event
  handleDayClick(event: any) {
    this.event.id = -1;
    this.event.title = '';
    var date = new Date(event.date.format());
    this.event.start = event.date.format().substr(0, 16).replace("T", " ");
    var datePlusHour = new Date(date.setMinutes(date.getMinutes() + 30));
    this.event.end = datePlusHour.toISOString().substr(0, 16).replace("T", " ");
    this.event.court_id = event.resourceObj.id;
    this.event.resourceId = event.resourceObj.id;
    let dateNow = new Date();
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
    if (this.selectedInstructor.id === -1) {
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

  // handle Edit Event Click
  handleEventClick(e: any) {
    this.event.title = e.calEvent.title;
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

    let dateNow = new Date();
    if (dateNow < start) {
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

  handleEventResize(e: any) {
    this.event.title = e.event.title;
    let start = e.event.start;
    let end = e.event.end;
    this.event.id = e.event.id;
    this.event.court_id = e.event.court_id;
    this.event.start = start.format().substr(0, 16).replace("T", " ");
    this.event.end = end.format().substr(0, 16).replace("T", " ");
    this.event.resourceId = e.event.resourceId;
    let dateNow = new Date();
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
        this.courtsDialog = [];
        this.resources = [];
        this.fcResources = [];
        for (var c of courts) {
          this.courts.push({label: c.name, value: c.id});
          this.fcResources.push(this.toFCResources(c));
          this.resources.push(this.toFCResources(c));
          this.courtsDialog.push({label: c.name, value: c.id});
        }
        this.selectedCourt = new Court(0, 'Все', '', 0, '');

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
      "instructor_id": `${event.instructor_id}`,
      "color": `${event.color}`,
      "resourceId": `${event.resourceId}`
    };
  }

  toFCResources(resource: EventResource) {
    return {
      "id": `${ resource.id }`,
      "title": `${ resource.title }`
    };
  }
}
