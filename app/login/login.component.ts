import {Component, OnInit} from '@angular/core';
import {Router} from "@angular/router";
import {AuthService} from "./auth.service";
import {Login} from "./login.class";
import {FormGroup, Validators, FormBuilder, FormControl} from '@angular/forms';

@Component({
  moduleId: module.id,
  selector: 'tsa-login',
  templateUrl: 'login.component.html'
})


export class LoginComponent implements OnInit {
  loginForm: FormGroup;
  login: Login[];

  constructor(public loginService: AuthService,
              private router: Router,
              private formBuilder: FormBuilder) {
  }

  ngOnInit() {
    this.loginForm = this.formBuilder.group({
      username: ['', Validators.required],
      password: ['', Validators.required]
    });
    this.loginForm = new FormGroup({
      username: new FormControl(),
      password: new FormControl()
    });

    /*    if(localStorage.getItem('id_token')!=null){
     this.router.navigate(['/instructors']);
     }*/

  }

  onSubmit() {
    this.loginService.login(this.loginForm.value);
  }
}

