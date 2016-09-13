import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import {InstructorsService} from "./instructors.service";
import { Subscription } from 'rxjs/Rx';
import {Instructor} from "./instructor.class";

@Component({
    moduleId: module.id,
    selector: 'tsa-instructor-edit',
    templateUrl: 'instructor-edit.component.html'
})

export class InstructorEditComponent implements OnInit, OnDestroy {
  instructorForm: FormGroup;
  private subscription: Subscription;
  instructorId: number;
  instructor: Instructor;

  constructor(private route: ActivatedRoute,
              private instructorsService: InstructorsService,
              private formBuilder: FormBuilder,
              private router: Router) {}

  ngOnInit() {
    this.subscription = this.route.params.subscribe(
      (params: any) => {
        if (params.hasOwnProperty('id')) {
          this.instructorId = +params['id'];
          this.instructor = this.instructorsService.getInstructorById(this.instructorId);
        }
      }
    );
    this.initForm();
  }

  private initForm() {
    this.instructorForm = this.formBuilder.group({
      id: [this.instructor.id, Validators.required],
      name: [this.instructor.name, Validators.required],
      address: [this.instructor.address, Validators.required],
      email: [this.instructor.email, Validators.required],
      phone: [this.instructor.phone, Validators.required]
    });
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  onCancel() {
    this.router.navigate(['/instructors']);
  }

  onSubmit() {
    const newInstructor = this.instructorForm.value;
    this.instructorsService.editInstructor(this.instructor, newInstructor);
    this.router.navigate(['/instructors']);
  }
}
