import { Component, OnInit, OnDestroy } from '@angular/core';
import { OrganizationServiceComponent } from '../shared/organization.service';
import { CacheService, CacheKeys } from '../shared';
import { User, Organization, ServiceEvents } from '../shared/models';

@Component({
  selector: 'my-details',
  providers: [],
  directives: [],
  pipes: [],
  styles: [require('./details.component.scss')],
  templateUrl: './details.component.html'
})
export class DetailsComponent implements OnInit, OnDestroy {

  organization: Organization;
  emailLink: string;
  loading: boolean;
  _logo: string;
  active: boolean;

  constructor(
    private organizationService: OrganizationServiceComponent,
    private cacheService: CacheService,
    private cacheKeys: CacheKeys) {

  }

  ngOnDestroy() {
    this.organizationService = null;
    this.active = false;
    console.log('Details component ngOnDestroy');
  }

  ngOnInit() {

    this.active = true;

    console.log('Details component ngOnInit');

    let userData = this.cacheService.get(this.cacheKeys.User);
    let user: User = JSON.parse(userData);
    let orgId = JSON.parse(this.cacheService.get(this.cacheKeys.CurrentOrganization));

    if (user.StartPage === 'Organization' && orgId === null) {
      orgId = user.Organizations[0].Item2;
      this.cacheService.put(this.cacheKeys.CurrentOrganization, orgId);
    }

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
    this.organizationService.subscribe((event: ServiceEvents) => {
      
      if (event === ServiceEvents.OrganizationReceived && this.active) {
        console.log('Details component listening to event: ' + event);
        orgData = this.cacheService.get(this.cacheKeys.Organization);
        this.organization = JSON.parse(orgData);
        this.emailLink = 'mailto:' + this.organization.Email;
        this._logo = this.organization.LogoFilePath + this.organization.LogoFileName + '.' + this.organization.LogoType;
        this.loading = false;
      }
    });
  }
}
