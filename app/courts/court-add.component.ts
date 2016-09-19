import {Component, OnInit} from '@angular/core';
import {FormGroup, FormBuilder, Validators} from '@angular/forms';
import {Router} from '@angular/router';
import {CourtsService} from "./courts.service";
import {Court} from "./court.class";
import {SelectItem} from "primeng/components/common/api";
import {CourtType} from "./court-type.class";

@Component({
  moduleId: module.id,
  selector: 'tsa-court-add',
  templateUrl: 'court-add.component.html'
})

export class CourtAddComponent implements OnInit {
  courtForm: FormGroup;
  court: Court;
  courtTypes: SelectItem[] = [];
  selectedCourtType: CourtType;

  constructor(public courtsService: CourtsService,
              private router: Router,
              private formBuilder: FormBuilder) {
  }

  ngOnInit() {
    this.courtForm = this.formBuilder.group({
      name: ['', Validators.required],
      court_type: ['', Validators.required]
    });

    this.courtsService.courtTypesUpdated.subscribe(
      (courtTypes: Court[]) => {
        for (var c of courtTypes) {
          this.courtTypes.push({label: c.name, value: c});
        }
      }
    );

    this.courtsService.fetchCourtTypes();
  }

  onCancel() {
    this.router.navigate(['/courts']);
  }

  onSubmit() {
    var court = new Court(-1, this.courtForm.value.name, this.selectedCourtType.name, this.selectedCourtType.id);
    this.courtsService.addCourt(court);
    this.router.navigate(['/courts']);
  }
}

