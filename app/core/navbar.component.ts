import {Component, OnInit} from '@angular/core';
import {AuthService} from "../login/auth.service";
import {Login} from "../login/login.class";
import {MenuItem} from "primeng/components/common/api";
import appGlobals = require('../app.global');

@Component({
  moduleId: module.id,
  selector: 'tsa-navbar',
  templateUrl: 'navbar.component.html'
})

export class NavbarComponent implements OnInit {
  login: Login;
  private menuItems: MenuItem[] = [];
  private activeItem: MenuItem = null;

  constructor(public authService: AuthService) {
    let role_code = localStorage.getItem("role_code");
    if (role_code != null) {
      if (role_code == 'operator') {
        this.menuItems = appGlobals.menuItemsOperator;
      } else if (role_code == 'instructor') {
        this.menuItems = appGlobals.menuItemsInstructor;
      } else if (role_code == 'client') {
        this.menuItems = appGlobals.menuItemsClient;
      }
      this.activeItem = this.menuItems[0];
    } else {
      this.authService.menuUpdated.subscribe(
        (menus: MenuItem[])=> {
          this.menuItems = menus;
          this.activeItem = this.menuItems[0];
        }
      );
    }
    console.log('menuItems:' + this.menuItems.length);
  }

  ngOnInit() {

  }

  getToken() {
    return localStorage.getItem('id_token');
  }

  getTokenRole() {
    return localStorage.getItem('role_code');
  }

}
