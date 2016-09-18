import {Component, OnInit} from '@angular/core';
import {Router} from "@angular/router";
import {CourtsService} from "./courts.service";
import {Court} from "./court.class";

@Component({
    moduleId: module.id,
    selector: 'tsa-courts',
    templateUrl: 'courts.component.html'
})

export class CourtsComponent implements OnInit {
    courts: Court[];

    constructor(public courtsService: CourtsService,
                private router: Router) {
    }

    ngOnInit() {
        this.courtsService.courtsUpdated.subscribe(
            (courts: Court[]) => {
                this.courts = courts;
            }
        );
        this.courts = this.courtsService.getCourts();
        if (localStorage.getItem('id_token') == null) {
            this.router.navigate(['/login']);
        }
        else if (this.courts.length === 0) {
            this.courtsService.fetchCourts();
        }


    }

    onDeleteCourt(court: Court) {
        this.courtsService.deleteCourt(court);
        this.router.navigate(['/courts']);
    }

    onEditCourt(court: Court) {
        this.router.navigate(['/courts', court.id, 'edit']);
    }

    onAddCourt() {
        this.router.navigate(['/courts/new']);
    }
}
