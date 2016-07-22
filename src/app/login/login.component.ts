import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { CacheService, CacheKeys } from '../shared';
import { LoginServiceComponent } from './login.service';
import { LoginParams } from './login-params';

@Component({
  selector: 'login',
  providers: [LoginServiceComponent],
  directives: [],
  pipes: [],
  styles: [require('./login.component.scss')],
  templateUrl: './login.component.html'
})
export class LoginComponent implements OnInit {

  loginParams: LoginParams;
  LoginErrors: any[] = [];
  waiting: boolean = false;
  cacheService: CacheService;
  cacheKeys: CacheKeys;

  constructor(
    private _loginService: LoginServiceComponent,
    private _cacheSerice: CacheService,
    private _cacheKeys: CacheKeys,
    private router: Router) {

    this.cacheService = _cacheSerice;
    this.cacheKeys = _cacheKeys;
  }

  doLogin() {

    let cache = this.cacheService;
    let cacheKeys = this.cacheKeys;
    let router = this.router;
    let loginErrors = this.LoginErrors;
    let waiting = this.waiting;

    this.waiting = true;
    this._loginService.login(this.loginParams)
      .subscribe(
      (user: any) => {

        cache.put(cacheKeys.User, user._body);
        waiting = false;
        loginErrors = [];
        router.navigate(['/details']);
      },
      (error) => {
        waiting = false;
        loginErrors.push(error);
      }
      );
  }

  ngOnInit() {
    this.loginParams = {
      UserName: '',
      Password: '',
      Token: '',
      EventTag: '',
      AcceptSharedCards: false
    };
    this.LoginErrors = [];
  }
}
