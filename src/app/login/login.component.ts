import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { CacheService, CacheKeys } from '../shared';
import { LoginServiceComponent } from './login.service';
import { LoginParams } from './login-params';
import { FORM_DIRECTIVES, REACTIVE_FORM_DIRECTIVES, FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'login',
  providers: [LoginServiceComponent],
  directives: [FORM_DIRECTIVES, REACTIVE_FORM_DIRECTIVES],
  pipes: [],
  styles: [require('./login.component.scss')],
  templateUrl: './login.component.html'
})
export class LoginComponent implements OnInit {

  loginParams: LoginParams;
  LoginErrors: any[] = [];
  waiting: boolean = false;
  cacheService: CacheService;
  loginForm: FormGroup;

  constructor(
    private loginService: LoginServiceComponent,
    private cacheSerice: CacheService,
    private cacheKeys: CacheKeys,
    private router: Router,
    private formBuilder: FormBuilder) {

    this.cacheService = cacheSerice;
    this.cacheKeys = cacheKeys;
    this.loginParams = {
      UserName: '',
      Password: '',
      Token: '',
      EventTag: '',
      AcceptSharedCards: false
    };
    this.loginForm = this.formBuilder.group({
      'username': [this.loginParams.UserName, Validators.required],
      'password': [this.loginParams.Password, Validators.required]
    });
  }

  doLogin() {

    let cache = this.cacheService;
    let cacheKeys = this.cacheKeys;
    let router = this.router;
    let loginErrors = this.LoginErrors;

    this.waiting = true;

    this.loginService.login(this.loginParams)
      .subscribe(
      (user: any) => {

        cache.put(cacheKeys.User, user._body);
        this.waiting = false;
        loginErrors = [];
        router.navigate(['/details']);
      },
      (error) => {
        let errorMessage = '';
        if (error.status === 404) {
          errorMessage = 'Invalid username / password combination';
        } else {
          errorMessage = 'There was a problem logging in.';
        }
        this.waiting = false;
        this.LoginErrors.push(errorMessage);
      }
      );
  }

  ngOnInit() {

    this.LoginErrors = [];


  }
}
