import {Component, OnInit, OnDestroy} from '@angular/core';
import {FormGroup, Validators, FormBuilder} from '@angular/forms';
import {ActivatedRoute, Router} from '@angular/router';
import {CourtsService} from "./courts.service";
import {Subscription} from 'rxjs/Rx';
import {Court} from "./court.class";
import {SelectItem} from "primeng/components/common/api";

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
    selectedCourtType: number;

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
                }
            }
        );

        this.courtsService.fecthCourtTypes();

        this.courtsService.courtTypesUpdated.subscribe(
            (courtTypes: Court[]) => {
                this.courtTypes.push({label: "", value: null});
                for (var c of courtTypes) {
                    this.courtTypes.push({label: c.name, value: c.id});
                }
                this.selectedCourtType = this.court.type_id;
            }
        )
        this.initForm();
    }

    private initForm() {
        this.courtForm = this.formBuilder.group({
            id: [this.court.id, Validators.required],
            name: [this.court.name, Validators.required],
            type: [this.court.type, Validators.required]
        });
    }

    ngOnDestroy() {
        this.subscription.unsubscribe();
    }

    onCancel() {
        this.router.navigate(['/courts']);
    }

    onSubmit() {
        const newCourt = this.courtForm.value;
        this.courtsService.editCourt(this.court, newCourt);
        this.router.navigate(['/courts']);
    }
}
