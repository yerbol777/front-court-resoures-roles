import {Component, OnInit, OnDestroy} from '@angular/core';
import {FormGroup, Validators, FormBuilder} from '@angular/forms';
import {ActivatedRoute, Router} from '@angular/router';
import {CourtsService} from "./courts.service";
import {Subscription} from 'rxjs/Rx';
import {Court} from "./court.class";
import {SelectItem} from "primeng/components/common/api";
import {CourtType} from "./court-type.class";

@Component({
  moduleId: module.id,
  selector: 'tsa-court-edit',
  templateUrl: 'court-edit.component.html'
})

export class CourtEditComponent implements OnInit, OnDestroy {
  courtForm: FormGroup;
  private subscription: Subscription;
  courtId: number;
  court: Court;
  courtTypes: SelectItem[] = [];
  selectedCourtType: CourtType;

  constructor(private route: ActivatedRoute,
              private courtsService: CourtsService,
              private formBuilder: FormBuilder,
              private router: Router) {
  }

  ngOnInit() {
    this.subscription = this.route.params.subscribe(
      (params: any) => {
        if (params.hasOwnProperty('id')) {
          this.courtId = +params['id'];
          this.court = this.courtsService.getCourtById(this.courtId);

          var courtTypes = this.courtsService.getCourtTypes();
          for (var c of courtTypes) {
            this.courtTypes.push({label: c.name, value: c});
          }
          for (var x of this.courtTypes) {
            if (x.value.id === this.court.type_id) {
              this.selectedCourtType = x.value;
              break;
            }
          }
        }
      }
    );

    this.initForm();
  }

  private initForm() {
    this.courtForm = this.formBuilder.group({
      id: [this.court.id, Validators.required],
      name: [this.court.name, Validators.required],
      court_type: [this.selectedCourtType, Validators.required]
    });
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  onCancel() {
    this.router.navigate(['/courts']);
  }

  onSubmit() {
    var newCourt = new Court(this.courtForm.value.id, this.courtForm.value.name, this.selectedCourtType.name, this.selectedCourtType.id, this.courtForm.value.name);
    this.courtsService.editCourt(this.court, newCourt);
    this.router.navigate(['/courts']);
  }
}
