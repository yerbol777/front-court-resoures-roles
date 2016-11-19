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
import {CalendarInstructorComponent} from "./calendar/calendar_instructor.component";

export const appRoutes = [
  {
    path: '',
    redirectTo: '/calendar',
    pathMatch: 'full'
  },
  {
    path: 'instructors',
    component: InstructorsComponent,
    canActivate: [AuthGuardService],
    data: {roles: ['operator']}
  },
  {
    path: 'instructors/new',
    component: InstructorAddComponent,
    canActivate: [AuthGuardService],
    data: {roles: ['operator']}
  },
  {
    path: 'instructors/:id/edit',
    component: InstructorEditComponent,
    canActivate: [AuthGuardService],
    data: {roles: ['operator']}
  },
  {
    path: 'calendar',
    component: CalendarComponent,
    canActivate: [AuthGuardService],
    data: {roles: ['operator']}
  },
  {
    path: 'calendar_instructor',
    component: CalendarInstructorComponent,
    canActivate: [AuthGuardService],
    data: {roles: ['operator']}
  },
  {
    path: 'courts',
    component: CourtsComponent,
    canActivate: [AuthGuardService],
    data: {roles: ['operator']}
  },
  {
    path: 'courts/new',
    component: CourtAddComponent,
    canActivate: [AuthGuardService],
    data: {roles: ['operator']}
  },
  {
    path: 'courts/:id/edit',
    component: CourtEditComponent,
    canActivate: [AuthGuardService],
    data: {roles: ['operator']}
  },
  {
    path: 'login',
    component: LoginComponent
  },
  {
    path: 'logout',
    component: LogoutComponent
  },
];

export const routing = RouterModule.forRoot(appRoutes);
