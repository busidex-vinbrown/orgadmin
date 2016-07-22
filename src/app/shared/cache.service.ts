import { Injectable } from '@angular/core';
import { CookieService } from 'angular2-cookie/core';
import { AppCookieOptions } from './app-cookie-options';
import { LocalStorage } from 'angular2-local-storage/local_storage';
import { CacheKeys } from './cache-keys';

@Injectable()
export class CacheService {
    private cache: any;

    constructor(private _cookieService: CookieService, private _localStorage: LocalStorage, private cacheKeys: CacheKeys) {
        this.cache = {};
    }

    get(key) {
        return this._cookieService.get(key) || this._localStorage[key] || this.cache[key] || null;
    }

    put(key, value) {

        if (key !== this.cacheKeys.Card) {
            try {
                this._cookieService.put(key, value);
                this._localStorage.set(key, value);
                this.cache[key] = value;
            } catch (e) {
                console.error('cache error!', e);
            }
        }
    };

    remove(key) {

        this.cache[key] = null;
        delete this.cache[key];
        this._cookieService.remove(key);
        this._localStorage.remove(key);
    }

    nuke() {

        let cookies = this._cookieService.getAll();

        for (let cookie in cookies) {
            if (cookies.hasOwnProperty(cookie)) {
                this._cookieService.remove(cookie, AppCookieOptions);
                this._localStorage.remove(cookie);
            }
        }
        this.cache = {};
    }
}
