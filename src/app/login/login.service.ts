import { Injectable, OnInit } from '@angular/core';
import { Http } from '@angular/http';
import { LoginParams } from './login-params';

const ROOT = 'https://www.busidexapi.com/api';

@Injectable()
export class LoginServiceComponent implements OnInit {

    constructor(private http: Http) {

    }

    login(params: LoginParams) {

        return this.http.post(ROOT + '/Account/Login/', params);
    }

    ngOnInit() {

    }
}
