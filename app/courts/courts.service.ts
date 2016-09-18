import { Injectable, EventEmitter } from '@angular/core';
import { Court } from "./court.class";
import {Http, Response, Headers} from "@angular/http";
import 'rxjs/Rx';
import {CourtTypes} from "./courtTypes.class";

@Injectable()
export class CourtsService {
  courts: Court[] = [];
  courtTypes: CourtTypes[] = [];
  courtsUpdated = new EventEmitter<Court[]>();
  courtTypesUpdated = new EventEmitter<CourtTypes[]>();

  constructor(private http: Http) {}

  getCourts() {
    return this.courts;
  }

  getCourtTypes() {
    return this.courtTypes;
  }

  getCourtById(id: number) {
    for (var court of this.courts) {
      if (court.id === id) {
        return court;
      }
    }
    return null;
  }

  deleteCourt(court: Court) {
    const id = court.id;
    this.courts.splice(this.courts.indexOf(court), 1);
    this.http.delete('http://localhost:3003/courts/' + id).subscribe((res) => {});
  }

  editCourt(oldCourt: Court, newCourt: Court) {
    this.courts[this.courts.indexOf(oldCourt)] = newCourt;
    const body = JSON.stringify(newCourt);
    const headers = new Headers({
      'Content-Type' : 'application/json'
    });
    return this.http.put('http://localhost:3003/courts', body, {headers: headers}).subscribe((res) => {
      this.courtsUpdated.emit(this.courts);
    });
  }

  addCourt(court: Court) {
    const body = JSON.stringify(court);
    const headers = new Headers({
      'Content-Type' : 'application/json'
    });
    return this.http.post('http://localhost:3003/courts', body, {headers: headers})
      .map((response: Response) => response.json())
      .subscribe((data) => {
        court.id = data[0].id;
        this.courts.push(court);
        this.courtsUpdated.emit(this.courts);
      });
  }

  fetchCourts() {
    return this.http.get('http://localhost:3003/courts')
      .map((response: Response) => response.json())
      .subscribe(
        (data: Court[]) => {
          this.courts = data;
          this.courtsUpdated.emit(this.courts);
        }
      );
  }
  fecthCourtTypes(){
    return this.http.get('http://localhost:3003/courtTypes')
        .map((response: Response) => response.json())
        .subscribe(
            (data: CourtTypes[]) => {
              this.courtTypes = data;
              this.courtTypesUpdated.emit(this.courtTypes);
            }
        );
  }
}
