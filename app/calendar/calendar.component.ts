import {Component, OnInit, ElementRef} from '@angular/core';
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
  event: CalendarEvent;
  dialogVisible: boolean = false;
  idGen: number = 100;
  courts: SelectItem[];
  selectedCourt: SelectItem = {label: 'Court #1', value: {id:1, name:"Court #1", type:"grass"}};

  constructor(private el: ElementRef, private calendarService: CalendarService) {
    this.courts = [{label: 'Court #1', value: {id:1, name:"Court #1", type:"grass"}},
                   {label: 'Court #2', value: {id:2, name:"Court #2", type:"hard"}}];
  }

  /*handleDayClick(event: any) {
    this.event = new CalendarEvent();
    this.event.start = event.date.format();
    this.dialogVisible = true;
    //trigger detection manually as somehow only moving the mouse quickly after click triggers the automatic detection
    //this.cd.detectChanges();
  }*/

  onDropdownChange() {
    console.log(this.selectedCourt.value);
    console.log('111');
    //this.calendarService.fetchEventsByCourtId(this.selectedCourt.value.id);
  }

  /*handleEventClick(e: any) {
    this.event = new CalEvent();
    this.event.title = e.calEvent.title;

    let start = e.calEvent.start;
    let end = e.calEvent.end;
    if(e.view.name === 'month') {
      start.stripTime();
    }

    if(end) {
      end.stripTime();
      this.event.end = end.format();
    }

    this.event.id = e.calEvent.id;
    this.event.start = start.format();
    this.event.allDay = e.calEvent.allDay;
    this.dialogVisible = true;
  }*/

  /*saveEvent() {
    //update
    if(this.event.id) {
      let index: number = this.findEventIndexById(this.event.id);
      if(index >= 0) {
        this.events[index] = this.event;
      }
    }
    //new
    else {
      this.event.id = this.idGen;
      this.events.push(this.event);
      this.event = null;
    }

    this.dialogVisible = false;
  }

  deleteEvent() {
    let index: number = this.findEventIndexById(this.event.id);
    if(index >= 0) {
      this.events.splice(index, 1);
    }
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
  }*/

  ngOnInit() {
    this.calendarService.eventsUpdated.subscribe(
      (events: CalendarEvent[]) => {
        this.events = events;
        this.fcEvents = [];
        for (var ev of this.events) {
          this.fcEvents.push(this.toFCEvent(ev));
        }
        console.log(this.fcEvents);

      }
    );
    this.events = this.calendarService.getEvents();
    if (this.events.length === 0) {
      this.calendarService.fetchEventsByCourtId(this.selectedCourt.value.id);
    }



    this.header = {
      left   : 'prev,next today',
      center : 'title',
      right  : 'agendaDay, agendaWeek'
    };
  }

  toFCEvent(event: CalendarEvent) {
    return {"id": `${ event.id }`,
            "title": `${ event.title }`,
            "start": `${ event.start_datetime }`,
            "end": `${event.end_datetime}`
    };
  }
}
