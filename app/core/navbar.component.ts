import {Component, OnInit} from '@angular/core';
import {AuthService} from "../login/auth.service";
import {Login} from "../login/login.class";
import {MenuItem} from "primeng/components/common/api";

@Component({
  moduleId: module.id,
  selector: 'tsa-navbar',
  templateUrl: 'navbar.component.html'
})

export class NavbarComponent implements OnInit {
  login: Login;
  private menuItems: MenuItem[];

  constructor(public authService: AuthService) {

  }

  ngOnInit() {
    this.authService.menuUpdated.subscribe(
      (menus: MenuItem[])=> {
        this.menuItems = menus;
      }
    );
  }

  getToken() {
    return localStorage.getItem('id_token');
  }

  getTokenRole() {
    return localStorage.getItem('role_code');
  }

}
