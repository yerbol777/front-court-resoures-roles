import {Injectable, EventEmitter} from '@angular/core';
import {Login} from "./login.class";
import {Http, Response, Headers} from "@angular/http";
import {Router} from "@angular/router";
import 'rxjs/Rx';


@Injectable()
export class AuthService {
  //login: Login[] = [];
  //loginUpdated = new EventEmitter<Login[]>();

  constructor(private http: Http,
              private router: Router) {
  }

  login(login: Login) {
    return this.http.post('http://localhost:3003/auth', {
      login
    }).map((response: Response) => response.json())
      .subscribe((data) => {
          localStorage.setItem("id_token", data.token);
          this.router.navigate(['/instructors']);
          //sessionStorage.setItem("id_token", data.token);

        },
        error => {
          alert(error.text());
        });
  }

  logout() {
    localStorage.removeItem("id_token");

  }

}
