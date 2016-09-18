import {Component, OnInit} from '@angular/core';
import {Router} from "@angular/router";

@Component({
  moduleId: module.id,
  selector: 'tsa-login',
  templateUrl: 'login.component.html'
})


export class LogoutComponent implements OnInit {

  constructor(private router: Router) { }

  ngOnInit() {
    localStorage.removeItem('id_token');
    this.router.navigate(['login']);
  }

}

