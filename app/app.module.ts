import {NgModule}      from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import {RouterModule} from "@angular/router";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {HttpModule} from "@angular/http";

import {routing} from "./app.routes";
import {AppComponent}  from './app.component';
import {InstructorsComponent} from "./instructors/instructors.component";
import {InstructorsService} from "./instructors/instructors.service";
import {FooterComponent} from "./core/footer.component";
import {NavbarComponent} from "./core/navbar.component";
import {InstructorEditComponent} from "./instructors/instructor-edit.component";
import {InstructorAddComponent} from "./instructors/instructor-add.component";
import {CalendarComponent} from "./calendar/calendar.component";
import {LoginComponent} from "./login/login.component";
import {LogoutComponent} from "./login/logout.component";
import {SchedulerComponent} from "./calendar/scheduler.component";
import {
  DialogModule,
  ToggleButtonModule,
  DropdownModule,
  TabViewModule,
  TabMenuModule
} from 'primeng/primeng';
import {CalendarService} from "./calendar/calendar.service";
import {CourtsComponent} from "./courts/courts.component";
import {CourtEditComponent} from "./courts/court-edit.component";
import {CourtAddComponent} from "./courts/court-add.component";
import {CourtsService} from "./courts/courts.service";
import {AuthService} from "./login/auth.service";
import {AuthGuardService} from "./auth-guard.service";
import {MenuModule} from "primeng/components/menu/menu";


@NgModule({
  imports: [BrowserModule,
    RouterModule,
    FormsModule,
    ReactiveFormsModule,
    HttpModule,
    DialogModule,
    ToggleButtonModule,
    TabViewModule,
    DropdownModule,
    routing,
    TabMenuModule,
    MenuModule],
  declarations: [AppComponent,
    InstructorsComponent,
    FooterComponent,
    NavbarComponent,
    InstructorEditComponent,
    InstructorAddComponent,
    CalendarComponent,
    CourtsComponent,
    CourtEditComponent,
    CourtAddComponent,
    LoginComponent,
    LogoutComponent,
    SchedulerComponent],
  providers: [InstructorsService, CalendarService, CourtsService, AuthService, AuthGuardService],
  bootstrap: [AppComponent]
})
export class AppModule {
}
