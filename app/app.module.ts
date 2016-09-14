import { NgModule }      from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule } from "@angular/router";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { HttpModule } from "@angular/http";

import { routing } from "./app.routes";
import { AppComponent }  from './app.component';
import { InstructorsComponent } from "./instructors/instructors.component";
import { InstructorsService } from "./instructors/instructors.service";
import { FooterComponent } from "./core/footer.component";
import { NavbarComponent } from "./core/navbar.component";
import { InstructorEditComponent } from "./instructors/instructor-edit.component";
import { InstructorAddComponent } from "./instructors/instructor-add.component";
import { CalendarComponent } from "./calendar/calendar.component";
import { ScheduleModule, DialogModule, CalendarModule, ToggleButtonModule, DropdownModule, TabViewModule } from 'primeng/primeng';
import { CalendarService } from "./calendar/calendar.service";

@NgModule({
  imports: [ BrowserModule,
             RouterModule,
             FormsModule,
             ReactiveFormsModule,
             HttpModule,
             ScheduleModule,
             DialogModule,
             CalendarModule,
             ToggleButtonModule,
             TabViewModule,
             DropdownModule,
             routing ],
  declarations: [ AppComponent,
                  InstructorsComponent,
                  FooterComponent,
                  NavbarComponent,
                  InstructorEditComponent,
                  InstructorAddComponent,
                  CalendarComponent],
  providers: [ InstructorsService, CalendarService ],
  bootstrap: [ AppComponent ]
})
export class AppModule { }
