import { Injectable, EventEmitter } from '@angular/core';
import { Http } from '@angular/http';
import { User } from '../shared/models';
import { CacheService, CacheKeys } from '../shared';

@Injectable()
export class BaseService extends EventEmitter<any> {

    constructor(protected http: Http, protected cacheService: CacheService, protected cacheKeys: CacheKeys) {
        super();
    }

    getUserToken(): string {
        let data = this.cacheService.get(this.cacheKeys.User);
        let user: User = JSON.parse(data);

        return (user !== null) ? user.Token : '';
    }
}
