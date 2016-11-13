import {Injectable, EventEmitter} from '@angular/core';
import {Court} from "./court.class";
import {Http, Response, Headers} from "@angular/http";
import 'rxjs/Rx';
import {CourtType} from "./court-type.class";
import appGlobals = require('../app.global'); //<==== config

@Injectable()
export class CourtsService {
  courts: Court[] = [];
  courtTypes: CourtType[] = [];
  courtsUpdated = new EventEmitter<Court[]>();
  courtTypesUpdated = new EventEmitter<CourtType[]>();
  headers = new Headers({
    'Content-Type': 'application/json',
    'Authorization': localStorage.getItem('id_token')
  });

  constructor(private http: Http) {
  }

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
    this.http.delete(appGlobals.rest_server + 'courts/' + id, {headers: this.headers}).subscribe((data) => {
      var res = JSON.stringify(data);
      var obj = JSON.parse(res);
      if (obj._body != null && obj._body != undefined) {
        if (obj._body == 'DONE') {
          this.courts.splice(this.courts.indexOf(court), 1);
          this.courtsUpdated.emit(this.courts);
        }
        else {
          var _body = JSON.parse(obj._body);
          if (_body != null && _body != undefined) {
            if (_body.errno == '1451') {
              alert("Невозможно удалить " + court.name + ", ограничение внешнего ключа. Необходимо удалить связанные данные.");
            }
            else {
              alert("Произошла ошибка. Обратитесь к администратору");
            }
          }
        }
      }
    });
  }

  editCourt(oldCourt: Court, newCourt: Court) {
    this.courts[this.courts.indexOf(oldCourt)] = newCourt;
    const body = JSON.stringify(newCourt);
    return this.http.put(appGlobals.rest_server + 'courts?nocache=' + new Date().getTime(), body, {headers: this.headers}).subscribe((res) => {
      this.courtsUpdated.emit(this.courts);
    });
  }

  addCourt(court: Court) {
    const body = JSON.stringify(court);
    return this.http.post(appGlobals.rest_server + 'courts?nocache=' + new Date().getTime(), body, {headers: this.headers})
      .map((response: Response) => response.json())
      .subscribe((data) => {
        court.id = data[0].id;
        this.courts.push(court);
        this.courtsUpdated.emit(this.courts);
      });
  }

  fetchCourts() {
    return this.http.get(appGlobals.rest_server + 'courts?nocache=' + new Date().getTime(), {headers: this.headers})
      .map((response: Response) => response.json())
      .subscribe(
        (data: Court[]) => {
          this.courts = data;
          this.courtsUpdated.emit(this.courts);
        }
      );
  }

  fetchCourtTypes() {
    return this.http.get(appGlobals.rest_server + 'courtTypes?nocache=' + new Date().getTime(), {headers: this.headers})
      .map((response: Response) => response.json())
      .subscribe(
        (data: CourtType[]) => {
          this.courtTypes = data;
          this.courtTypesUpdated.emit(this.courtTypes);
        }
      );
  }
}
