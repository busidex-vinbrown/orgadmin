import { Injectable, OnInit } from '@angular/core';
import { Http } from '@angular/http';
import { LoginParams } from './login-params';
import { CacheService, CacheKeys, BaseService } from '../shared';
import { ServiceEvents } from '../shared/models';

const ROOT = 'https://www.busidexapi.com/api';

@Injectable()
export class LoginServiceComponent extends BaseService {

    constructor(protected http: Http, protected cacheService: CacheService, protected cacheKeys: CacheKeys) {
        super(http, cacheService, cacheKeys)
    }

    login(params: LoginParams) {

        return this.http.post(ROOT + '/Account/Login/', params)
            .subscribe(
            (user: any) => {
                this.cacheService.put(this.cacheKeys.User, user._body);
                this.emit(ServiceEvents.UserLoggedIn);
            }
            ,
            (error) => {
                this.cacheService.put(this.cacheKeys.User, null);
                this.emit(ServiceEvents.LoginError);
            });
    }

    ngOnInit() {

    }
}
