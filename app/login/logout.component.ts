import {Component, OnInit} from '@angular/core';
import {Router} from "@angular/router";
import {AuthService} from "./auth.service";

@Component({
  moduleId: module.id,
  selector: 'tsa-login',
  templateUrl: 'login.component.html'
})


export class LogoutComponent implements OnInit {

  constructor(private router: Router) { }

  ngOnInit() {
    localStorage.removeItem('id_token');
    localStorage.removeItem('role_code');
    localStorage.removeItem('user_id');
    localStorage.removeItem('instructor_id');
    this.router.navigate(['login']);
    //window.location.replace('/login');
  }

}

