import {Injectable, EventEmitter} from '@angular/core';
import {Instructor} from "./instructor.class";
import {Http, Response, Headers} from "@angular/http";
import 'rxjs/Rx';
import appGlobals = require('../app.global'); //<==== config

@Injectable()
export class InstructorsService {
  instructors: Instructor[] = [];
  instructorsUpdated = new EventEmitter<Instructor[]>();
  headers = new Headers({
    'Content-Type': 'application/json',
    'Authorization': localStorage.getItem('id_token')
  });

  constructor(private http: Http) {
  }

  getInstructors() {
    return this.instructors;
  }

  getInstructorById(id: number) {
    for (var instructor of this.instructors) {
      if (instructor.id === id) {
        return instructor;
      }
    }
    return null;
  }

  deleteInstructor(instructor: Instructor) {
    const id = instructor.id;
    this.http.delete(appGlobals.rest_server + 'instructors/' + id, {headers: this.headers}).subscribe((data) => {
      var res = JSON.stringify(data);
      var obj = JSON.parse(res);
      if (obj._body != null && obj._body != undefined) {
        if (obj._body == 'DONE') {
          this.instructors.splice(this.instructors.indexOf(instructor), 1);
          this.instructorsUpdated.emit(this.instructors);
        }
        else {
          var _body = JSON.parse(obj._body);
          if (_body != null && _body != undefined) {
            if (_body.errno == '1451') {
              alert("Невозможно удалить " + instructor.name + ", ограничение внешнего ключа. Необходимо удалить связанные данные.");
            }
            else {
              alert("Произошла ошибка. Обратитесь к администратору");
            }
          }
        }
      }
    });
  }

  editInstructor(oldInstructor: Instructor, newInstructor: Instructor) {
    this.instructors[this.instructors.indexOf(oldInstructor)] = newInstructor;
    const body = JSON.stringify(newInstructor);
    return this.http.put(appGlobals.rest_server + 'instructors?nocache=' + new Date().getTime(), body, {headers: this.headers}).subscribe((res) => {
      this.instructorsUpdated.emit(this.instructors);
    });
  }

  addInstructor(instructor: Instructor) {
    const body = JSON.stringify(instructor);
    return this.http.post(appGlobals.rest_server + 'instructors?nocache' + new Date().getTime(), body, {headers: this.headers})
      .map((response: Response) => response.json())
      .subscribe((data) => {
        instructor.id = data[0].id;
        this.instructors.push(instructor);
        this.instructorsUpdated.emit(this.instructors);
      });
  }

  fetchInstructors() {
    return this.http.get(appGlobals.rest_server + 'instructors?nocache=' + new Date().getTime(), {headers: this.headers})
      .map((response: Response) => response.json())
      .subscribe(
        (data: Instructor[]) => {
          this.instructors = data;
          this.instructorsUpdated.emit(this.instructors);
        }
      );
  }
}
