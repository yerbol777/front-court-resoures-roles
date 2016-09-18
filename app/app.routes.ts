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

export const appRoutes = [
  {path: '', redirectTo: '/instructors', pathMatch: 'full'},
  {path: 'instructors', component: InstructorsComponent},
  {path: 'instructors/new', component: InstructorAddComponent},
  {path: 'instructors/:id/edit', component: InstructorEditComponent},
  {path: 'calendar', component: CalendarComponent},
  {path: 'courts', component: CourtsComponent},
  {path: 'courts/new', component: CourtAddComponent},
  {path: 'courts/:id/edit', component: CourtEditComponent },
  {path: 'login', component: LoginComponent },
  {path: 'logout', component: LogoutComponent },

];

export const routing = RouterModule.forRoot(appRoutes);
