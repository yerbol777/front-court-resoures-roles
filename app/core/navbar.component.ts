import {Component, OnInit} from '@angular/core';
import {AuthService} from "../login/auth.service";
import {Login} from "../login/login.class";

@Component({
  moduleId: module.id,
  selector: 'tsa-navbar',
  templateUrl: 'navbar.component.html'
})

export class NavbarComponent implements OnInit {
  login: Login

  constructor(public authService: AuthService) {
  }

  ngOnInit() {
    //this.login.token = 'test';
  }
  getToken(){
    return localStorage.getItem('id_token');
  }

}
