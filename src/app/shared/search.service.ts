import { Injectable } from '@angular/core';
import { Http, Headers } from '@angular/http';
import { CacheService, CacheKeys, BaseService } from '../shared';

const ROOT = 'https://www.busidexapi.com/api';

@Injectable()
export class SearchServiceComponent extends BaseService {

    constructor(protected http: Http, protected cacheService: CacheService, protected cacheKeys: CacheKeys) {
        super(http, cacheService, cacheKeys);
    }

    post(model: any) {
        let headers = new Headers();
        headers.append('X-Authorization-Token', this.getUserToken());
        headers.append('Content-Type', 'application/json');

        return this.http.post(ROOT + '/search/Search?', JSON.stringify(model), { headers: headers });
    }
}
