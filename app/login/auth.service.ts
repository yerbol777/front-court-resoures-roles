import {Injectable} from '@angular/core';
import {Login} from "./login.class";
import {Http, Response} from "@angular/http";
import {Router} from "@angular/router";
import 'rxjs/Rx';
import appGlobals = require('../app.global'); //<==== config


@Injectable()
export class AuthService {
  //login: Login[] = [];
  //loginUpdated = new EventEmitter<Login[]>();
  public isLoggedIn = false;
  // store the URL so we can redirect after logging in
  redirectUrl = '/';

  constructor(private http: Http,
              private router: Router) {
    if (localStorage.getItem('id_token') != null) {
      this.isLoggedIn = true;
    }
  }

  login(login: Login) {
    return this.http.post(appGlobals.rest_server + 'auth?nocache=' + new Date().getTime(), {
      login
    }).map((response: Response) => response.json())
      .subscribe((data) => {
          localStorage.setItem("id_token", data.token);
          this.isLoggedIn = true;
          this.router.navigate([this.redirectUrl]);
        },
        error => {
          alert(error.text());
        });
  }

  logout() {
    localStorage.removeItem("id_token");
    this.isLoggedIn = false;
  }
}
