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


@NgModule({
  imports: [ BrowserModule, RouterModule, routing, FormsModule, ReactiveFormsModule, HttpModule ],
  declarations: [ AppComponent,
                  InstructorsComponent,
                  FooterComponent,
                  NavbarComponent,
                  InstructorEditComponent, InstructorAddComponent],
  providers: [ InstructorsService ],
  bootstrap: [ AppComponent ]
})
export class AppModule { }
