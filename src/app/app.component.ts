import { Component, OnInit } from '@angular/core';
import { ROUTER_DIRECTIVES, Router } from '@angular/router';
import { OrganizationServiceComponent } from './shared/organization.service';
import { ApiService, CacheService, CacheKeys } from './shared';
import { User, ServiceEvents, Organization } from './shared/models';

import '../styles/app.scss';

/* 
 * App Component
 * Top Level Component
 */
@Component({
  selector: 'my-app', // <my-app></my-app>
  providers: [ApiService],
  directives: [...ROUTER_DIRECTIVES],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  Organization: any = {};
  EditingDetails: boolean = false;
  ReferralLabel: string = 'Referrals';
  visible: boolean = true;
  loggedIn: boolean = false;
  user: User;
  isAdmin: boolean;

  constructor(
    private api: ApiService,
    private organizationService: OrganizationServiceComponent,
    private cacheService: CacheService,
    private cacheKeys: CacheKeys,
    private router: Router) {

    this.router.events.subscribe((val) => {
      this.visible = window.location.href.indexOf('login') < 0;
      this.loggedIn = this.cacheService.get(this.cacheKeys.User) !== undefined;
    });
  }

  private checkAdmin(orgId: number): boolean {
    return this.user && this.user.StartPage === 'Organization' && orgId === this.user.Organizations[0].Item2;
  }

  ngOnInit() {

    let data = this.cacheService.get(this.cacheKeys.User) || null;
    this.user = JSON.parse(data);
    this.loggedIn = this.user !== null;
    let orgId = JSON.parse(this.cacheService.get(this.cacheKeys.CurrentOrganization));

    if (!this.loggedIn) {
      this.router.navigate(['/login']);
      return;
    }

    let orgData = this.cacheService.get(this.cacheKeys.Organization);
    if (orgData) {
      let organization: Organization = JSON.parse(orgData);
      this.ReferralLabel = organization.ReferralLabel;
      orgId = organization.OrganizationId;
    } else {
      if (this.user.StartPage === 'Organization' && orgId === null) {
        orgId = this.user.Organizations[0].Item2;
        this.cacheService.put(this.cacheKeys.CurrentOrganization, orgId);
      }
      this.organizationService.getOrganization(orgId);
    }

    this.isAdmin = this.user.StartPage === 'Organization' && orgId === this.user.Organizations[0].Item2;
    console.log('IsAdmin is ', this.isAdmin);
    console.log('Current organization is ', orgId);

    // Subscribe to organization service events
    this.organizationService.subscribe((event: ServiceEvents) => {

      if (event === ServiceEvents.OrganizationReceived) {
        let orgData = this.cacheService.get(this.cacheKeys.Organization);
        let organization: Organization = JSON.parse(orgData);
        this.ReferralLabel = organization.ReferralLabel;
        this.isAdmin = this.checkAdmin(orgId);
      }

      if (event === ServiceEvents.UserLoggedIn) {
        let data = this.cacheService.get(this.cacheKeys.User) || null;
        this.user = JSON.parse(data);
        this.isAdmin = this.checkAdmin(orgId);
      }
    });
  }
}
