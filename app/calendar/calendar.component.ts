import {Component, OnInit, ChangeDetectorRef} from '@angular/core';
import {SelectItem} from 'primeng/primeng';
import {CalendarService} from "./calendar.service";
import {CalendarEvent} from "./event.class";
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
  courts: SelectItem[];
  selectedCourt: SelectItem;
  allDaySlot:boolean;
  locale: string;

  constructor(private cd: ChangeDetectorRef, private calendarService: CalendarService) {
    this.courts = [{label: 'Court #1', value: {id:1, name:"Court #1", type:"grass"}},
                   {label: 'Court #2', value: {id:2, name:"Court #2", type:"hard"}}];
    this.selectedCourt = {label: 'Court #1', value: {id:1, name:"Court #1", type:"grass"}};
    this.event.court_id =  this.selectedCourt.value.id;
  }

  handleDayClick(event: any) {
    var date = new Date(event.date.format());
    this.event.start = event.date.format().substr(0,16);
    var datePlusHour = new Date(date.setHours(date.getHours()+1));
    this.event.end = datePlusHour.toISOString().substr(0,16);

    this.dialogVisible = true;
    //trigger detection manually as somehow only moving the mouse quickly after click triggers the automatic detection
    //this.cd.detectChanges();
  }

  onDropdownChange() {
    this.calendarService.fetchEventsByCourtId(this.selectedCourt.value.id);
    this.event.court_id =  this.selectedCourt.value.id;
  }

  handleEventClick(e: any) {
    this.event.title = e.calEvent.title;
    let start = e.calEvent.start;
    let end = e.calEvent.end;
    this.event.id = e.calEvent.id;
    this.event.start = start.format().substr(0,16);
    this.event.end = end.format().substr(0,16);
    this.dialogVisible = true;
    console.log(this.event.id);
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
    console.log('event resize');
    console.log(e.event.end);
    console.log(e);
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
    this.event = {id: -1, start: '', end: '', title: '', instructor_id: -1, court_id: this.selectedCourt.value.id};
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
    this.calendarService.eventsUpdated.subscribe(
      (events: CalendarEvent[]) => {
        this.events = events;
        this.fcEvents = [];
        for (var ev of this.events) {
          this.fcEvents.push(this.toFCEvent(ev));
        }
      }
    );
    this.events = this.calendarService.getEvents();
    if (this.events.length === 0) {
      this.calendarService.fetchEventsByCourtId(this.selectedCourt.value.id);
    }



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
