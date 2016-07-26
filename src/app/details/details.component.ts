import { Component, OnInit } from '@angular/core';
import { OrganizationServiceComponent } from '../shared/organization.service';
import { CacheService, CacheKeys } from '../shared';
import { User, OrganizationServiceEvents } from '../shared/models';

@Component({
  selector: 'my-details',
  providers: [],
  directives: [],
  pipes: [],
  styles: [require('./details.component.scss')],
  templateUrl: './details.component.html'
})
export class DetailsComponent implements OnInit {

  organization: any;
  emailLink: string;
  loading: boolean;
  _logo: string;

  constructor(
    private organizationService: OrganizationServiceComponent,
    private cacheService: CacheService,
    private cacheKeys: CacheKeys) {

  }

  ngOnInit() {

    let userData = this.cacheService.get(this.cacheKeys.User);
    let user: User = JSON.parse(userData);

    if (user.StartPage === 'Organization') {
      let orgId = user.Organizations[0].Item2;
      let orgData = this.cacheService.get(this.cacheKeys.Organization);
      if (orgData) {
        this.organization = JSON.parse(orgData);
        this.emailLink = 'mailto:' + this.organization.Email;
        this._logo = this.organization.LogoFilePath + this.organization.LogoFileName + '.' + this.organization.LogoType;
      } else {
        this.loading = true;
        this.organizationService.getOrganization(orgId);
      }

      // Subscribe to organization service events
      this.organizationService.subscribe((event: OrganizationServiceEvents) => {
        console.log('Details component listening to event: ' + event);

        if (event === OrganizationServiceEvents.OrganizationReceived) {
          orgData = this.cacheService.get(this.cacheKeys.Organization);
          this.organization = JSON.parse(orgData);
          this.emailLink = 'mailto:' + this.organization.Email;
          this._logo = this.organization.LogoFilePath + this.organization.LogoFileName + '.' + this.organization.LogoType;
          this.loading = false;
        }
      });

    } else {
      if (window.location.href.indexOf('localhost') >= 0) {
        window.location.href = '/login';
      } else {
        window.location.href = 'https://www.busidex.com';
      }
    }
  }
}
