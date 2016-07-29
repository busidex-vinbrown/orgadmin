import { enableProdMode } from '@angular/core';
import { bootstrap } from '@angular/platform-browser-dynamic';
import { HTTP_PROVIDERS } from '@angular/http';
import { provide } from '@angular/core';
import { AppComponent } from './app/app.component';
import { APP_ROUTER_PROVIDERS } from './app/app.routes';
import { OrganizationServiceComponent } from './app/shared/organization.service';
import { SearchServiceComponent } from './app/shared/search.service';
import { CookieService, BaseCookieOptions, CookieOptions } from 'angular2-cookie/core';
import { LocalStorage } from 'angular2-local-storage/local_storage';
import { AppCookieOptions } from './app/shared/app-cookie-options';
import { CacheService } from './app/shared/cache.service';
import { CacheKeys } from './app/shared/cache-keys';
import { provideForms, disableDeprecatedForms } from '@angular/forms';

require('font-awesome-webpack!./font-awesome.config.js');
// depending on the env mode, enable prod mode or add debugging modules
if (process.env.ENV === 'build') {
  enableProdMode();
}



bootstrap(AppComponent, [
  // These are dependencies of our App
  disableDeprecatedForms(),
  HTTP_PROVIDERS,
  APP_ROUTER_PROVIDERS,
  OrganizationServiceComponent,
  SearchServiceComponent,
  CookieService,
  CacheService,
  CacheKeys,
  LocalStorage,
  provideForms(),
  provide(CookieOptions, { useClass: (window.location.href.indexOf('local') < 0) ? BaseCookieOptions : AppCookieOptions })
])
  .catch(err => console.error(err));
