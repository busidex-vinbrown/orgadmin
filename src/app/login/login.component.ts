import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';

import { CacheService, CacheKeys } from '../shared';
import { LoginServiceComponent } from './login.service';
import { LoginParams } from './login-params';
import { FORM_DIRECTIVES, REACTIVE_FORM_DIRECTIVES, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ServiceEvents } from '../shared/models';

@Component({
  selector: 'login',
  providers: [LoginServiceComponent],
  directives: [FORM_DIRECTIVES, REACTIVE_FORM_DIRECTIVES],
  pipes: [],
  styles: [require('./login.component.scss')],
  templateUrl: './login.component.html'
})
export class LoginComponent implements OnInit, OnDestroy {

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

    this.loginService.login(this.loginParams);
  }

  ngOnDestroy() {
    // this.loginService.unsubscribe();
  }

  ngOnInit() {

    this.LoginErrors = [];
    this.loginService.subscribe((event: ServiceEvents) => {

      if (event === ServiceEvents.UserLoggedIn) {
        this.LoginErrors = [];
        this.waiting = false;
        this.router.navigate(['/details']);
      }

      if (event === ServiceEvents.LoginError) {
        this.waiting = false;
        this.LoginErrors.push('Invalid username / password combination');
      }
    });
  }
}
