import {RouterModule} from '@angular/router';

import {InstructorsComponent} from "./instructors/instructors.component";
import {InstructorEditComponent} from "./instructors/instructor-edit.component";
import {InstructorAddComponent} from "./instructors/instructor-add.component";
import {CalendarComponent} from "./calendar/calendar.component";
import {CourtsComponent} from "./courts/courts.component";
import {CourtEditComponent} from "./courts/court-edit.component";
import {CourtAddComponent} from "./courts/court-add.component";
import {LoginComponent} from "./login/login.component";
import {LogoutComponent} from "./login/logout.component";
import {AuthGuardService} from "./auth-guard.service";

export const appRoutes = [
  {path: '', redirectTo: '/calendar', pathMatch: 'full'},
  {path: 'instructors', component: InstructorsComponent, canActivate: [AuthGuardService]},
  {path: 'instructors/new', component: InstructorAddComponent, canActivate: [AuthGuardService]},
  {path: 'instructors/:id/edit', component: InstructorEditComponent, canActivate: [AuthGuardService]},
  {path: 'calendar', component: CalendarComponent, canActivate: [AuthGuardService]},
  {path: 'courts', component: CourtsComponent, canActivate: [AuthGuardService]},
  {path: 'courts/new', component: CourtAddComponent, canActivate: [AuthGuardService]},
  {path: 'courts/:id/edit', component: CourtEditComponent, canActivate: [AuthGuardService]},
  {path: 'login', component: LoginComponent },
  {path: 'logout', component: LogoutComponent },

];

export const routing = RouterModule.forRoot(appRoutes);
