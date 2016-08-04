import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CacheService } from '../shared/cache.service';

@Component({
  selector: 'logout',
  providers: [],
  directives: [],
  pipes: [],
  styles: [],
  templateUrl: './logout.component.html'
})
export class LogoutComponent {
  constructor(private _cacheSerice: CacheService, private router: Router) {
    this._cacheSerice.nuke();
    if (window.location.href.indexOf('localhost') < 0) {
      window.location.href = 'https://www.busidex.com/#/logout'
    }else{
      this.router.navigate(['/login']);
    }
  }
}
