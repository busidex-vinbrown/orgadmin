import { BaseCookieOptions } from 'angular2-cookie/core';

export class AppCookieOptions extends BaseCookieOptions {
  domain: string = window.location.href.indexOf('localhost') >= 0 ? '' : 'busidex.com';
  path: string = window.location.href.indexOf('localhost') >= 0 ? '' : 'busidex.com';
  secure: boolean = window.location.href.indexOf('localhost') >= 0 ? false : true;
}
