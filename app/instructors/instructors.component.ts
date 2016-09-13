import { Component, OnInit } from '@angular/core';
import { Router } from "@angular/router";
import { InstructorsService } from "./instructors.service";
import { Instructor } from "./instructor.class";

@Component({
  moduleId: module.id,
  selector: 'tsa-instructors',
  templateUrl: 'instructors.component.html'
})

export class InstructorsComponent implements OnInit {
  instructors: Instructor[];

  constructor(public instructorsService: InstructorsService,
              private router: Router) { }

  ngOnInit() {
    this.instructorsService.instructorsUpdated.subscribe(
      (instructors: Instructor[]) => {this.instructors = instructors;}
    );
    this.instructors = this.instructorsService.getInstructors();
    if (this.instructors.length === 0) {
      this.instructorsService.fetchInstructors();
      console.log('fetch');
    }
  }

  onDeleteInstructor(instructor: Instructor) {
    this.instructorsService.deleteInstructor(instructor);
    this.router.navigate(['/instructors']);
  }

  onEditInstructor(instructor: Instructor) {
    this.router.navigate(['/instructors', instructor.id, 'edit']);
  }

  onAddInstructor() {
    this.router.navigate(['/instructors/new']);
  }
}
