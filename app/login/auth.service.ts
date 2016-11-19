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
  public activeItem: MenuItem;
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
          localStorage.setItem("instructor_id", data.instructor_id);
          localStorage.setItem("user_id", data.user_id);
          this.fetchMenuItems(data.role_code);
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

  fetchMenuItems(roleCode: string) {
    if (roleCode == 'operator') {
      this.menuItems = appGlobals.menuItemsOperator;
    } else if (roleCode == 'instructor') {
      this.menuItems = appGlobals.menuItemsInstructor;
    } else if (roleCode == 'client') {
      this.menuItems = appGlobals.menuItemsClient;
    }
    this.activeItem = this.menuItems[0];
  }
}
