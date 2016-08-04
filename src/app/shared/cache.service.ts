import { Injectable } from '@angular/core';
import { CookieService, CookieOptions } from 'angular2-cookie/core';
import { LocalStorage } from 'angular2-local-storage/local_storage';
import { CacheKeys } from './cache-keys';

@Injectable()
export class CacheService {
    private cache: any;

    constructor(
        private _cookieService: CookieService,
        private _localStorage: LocalStorage,
        private cacheKeys: CacheKeys,
        private cookieOptions: CookieOptions) {

        this.cache = {};
    }

    get(key) {
        return this._localStorage[key] || this._cookieService.get(key) || this.cache[key] || null;
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

        for (let cookie in this.cacheKeys) {
            let key = this.camelize(cookie);
            this._localStorage.remove(key);
        }
        this._cookieService.removeAll();
        this.cache = {};
    }

    private camelize(str): string {
        return str.replace(/(?:^\w|[A-Z]|\b\w)/g, function (letter, index) {
            return index === 0 ? letter.toLowerCase() : letter.toUpperCase();
        }).replace(/\s+/g, '');
    }
}
