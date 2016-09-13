import { Component, OnInit } from '@angular/core';
import {FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { InstructorsService } from "./instructors.service";
import { Instructor } from "./instructor.class";

@Component({
    moduleId: module.id,
    selector: 'tsa-instructor-add',
    templateUrl: 'instructor-add.component.html'
})

export class InstructorAddComponent implements OnInit {
  instructorForm: FormGroup;
  instructor: Instructor;

  constructor(private instructorsService: InstructorsService,
              private router: Router,
              private formBuilder: FormBuilder) {}

  ngOnInit() {
    this.instructorForm = this.formBuilder.group({
      name: ['', Validators.required],
      address: ['', Validators.required],
      email: ['', Validators.required],
      phone: ['', Validators.required]
    });
  }

  onCancel() {
    this.router.navigate(['/instructors']);
  }

  onSubmit() {
    this.instructorsService.addInstructor(this.instructorForm.value);
    this.router.navigate(['/instructors']);
  }
}
