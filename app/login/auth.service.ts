import {Injectable, EventEmitter} from "@angular/core";
import {Login} from "./login.class";
import {Http, Response} from "@angular/http";
import {Router} from "@angular/router";
import 'rxjs/Rx';
import appGlobals = require('../app.global');
import {MenuItem} from "primeng/components/common/api"; //<==== config


@Injectable()
export class AuthService {
  //login: Login[] = [];
  //loginUpdated = new EventEmitter<Login[]>();
  public isLoggedIn = false;
  public roleCode = null;
  // store the URL so we can redirect after logging in
  redirectUrl = '/';
  public menuItems: MenuItem[];
  menuUpdated = new EventEmitter<MenuItem[]>();

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
          localStorage.setItem("role_code", data.role_code);
          if (localStorage.getItem("role_code") == 'operator') {
            this.menuItems = [
              {label: 'Календарь', routerLink: ['/calendar']},
              {label: 'Инструкторы', routerLink: ['/instructors']},
              {label: 'Корты', routerLink: ['/courts']},
              {label: 'Выход', routerLink: ['/logout']},
            ];
          } else if (localStorage.getItem("role_code") == 'instructor') {
            this.menuItems = [
              {label: 'Календарь', routerLink: ['/calendar']},
              {label: 'Выход', routerLink: ['/logout']},
            ];
          }
          this.menuUpdated.emit(this.menuItems);
          this.isLoggedIn = true;
          this.roleCode = data.role_code;
          this.router.navigate([this.redirectUrl]);
        },
        error => {
          alert(error.text());
        });
  }

  logout() {
    this.isLoggedIn = false;
  }
}
