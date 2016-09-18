/**
 * Created by body on 9/15/16.
 */
import {Component, OnInit} from '@angular/core';
import {FormGroup, FormBuilder, Validators} from '@angular/forms';
import {Router} from '@angular/router';
import {CourtsService} from "./courts.service";
import {Court} from "./court.class";
import {CourtTypes} from "./courtTypes.class";
import {SelectItem} from "primeng/components/common/api";

@Component({
    moduleId: module.id,
    selector: 'tsa-court-add',
    templateUrl: 'court-add.component.html'
})

export class CourtAddComponent implements OnInit {
    courtForm: FormGroup;
    court: Court;
    courtTypes: SelectItem[] = [];

    constructor(public courtsService: CourtsService,
                private router: Router,
                private formBuilder: FormBuilder) {
    }

    ngOnInit() {
        this.courtForm = this.formBuilder.group({
            name: ['', Validators.required],
            type: ['', Validators.required]
        });
        this.courtsService.fecthCourtTypes();

        this.courtsService.courtTypesUpdated.subscribe(
            (courtTypes: Court[]) => {
                this.courtTypes.push({label: "", value: null});
                for (var c of courtTypes) {
                    this.courtTypes.push({label: c.name, value: c.id});
                }
            }
        )
    }

    onCancel() {
        this.router.navigate(['/courts']);
    }

    onSubmit() {
        this.courtsService.addCourt(this.courtForm.value);
        this.router.navigate(['/courts']);
    }
}

