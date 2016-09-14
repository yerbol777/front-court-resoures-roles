import { RouterModule } from '@angular/router';

import { InstructorsComponent } from "./instructors/instructors.component";
import { InstructorEditComponent } from "./instructors/instructor-edit.component";
import { InstructorAddComponent } from "./instructors/instructor-add.component";
import {CalendarComponent} from "./calendar/calendar.component";

export const appRoutes = [
  { path: '', redirectTo: '/instructors', pathMatch: 'full' },
  { path: 'instructors', component: InstructorsComponent},
  { path: 'instructors/new', component: InstructorAddComponent},
  { path: 'instructors/:id/edit', component: InstructorEditComponent},
  { path: 'calendar', component: CalendarComponent}
];

export const routing = RouterModule.forRoot(appRoutes);
