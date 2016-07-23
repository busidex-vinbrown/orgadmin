import { Component, OnInit } from '@angular/core';
import { ROUTER_DIRECTIVES, Router } from '@angular/router';
import { TabItem } from './tab.enum';
import { OrganizationServiceComponent } from './shared/organization.service';
import { Response } from '@angular/http';
import { ApiService, CacheService, CacheKeys } from './shared';
import { User, OrganizationServiceEvents } from './shared/models';

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
  Tabs: any;
  TabItems: any;
  Organization: any;
  EditingDetails: boolean;
  ReferralLabel: string = 'Referrals';
  visible: boolean = true;
  loggedIn: boolean = false;

  constructor(
    private api: ApiService,
    private organizationService: OrganizationServiceComponent,
    private cacheService: CacheService,
    private cacheKeys: CacheKeys,
    private router: Router) {

    this.TabItems = TabItem;

    this.router.events.subscribe((val) => {
      this.visible = window.location.href.indexOf('login') < 0;
      this.loggedIn = this.cacheService.get(this.cacheKeys.User) !== undefined;
    });

  }

  private setTabs() {
    this.Tabs = this.Tabs || {};
    this.Tabs[TabItem.Home] = false;
    this.Tabs[TabItem.Details] = false;
    this.Tabs[TabItem.EditDetails] = false;
    this.Tabs[TabItem.AddMembers] = false;
    this.Tabs[TabItem.Guests] = false;
    this.Tabs[TabItem.Members] = false;
    this.Tabs[TabItem.AddGroup] = false;
    this.Tabs[TabItem.Referrals] = false;
    this.Tabs[TabItem.AddReferrals] = false;
    this.Tabs[TabItem.GroupDetails] = false;
    this.Tabs[TabItem.HomePage] = false;
    this.Tabs[TabItem.Share] = false;
    this.Tabs[TabItem.Login] = false;
  }

  IsOrganizationAdmin() {
    return true;
  }

  SetCurrentTab(tab: TabItem) {

    this.setTabs();
    this.Tabs[tab] = true;
    this.visible = window.location.href.indexOf('login') < 0;
  }

  ngOnInit() {
    
    let data = this.cacheService.get(this.cacheKeys.User) || null;
    let user: User = JSON.parse(data);
    this.loggedIn = user !== null;

    if (this.loggedIn) {
      let orgData = this.cacheService.get(this.cacheKeys.Organization);
      if (orgData) {
        let organization = JSON.parse(orgData);
        this.ReferralLabel = organization.ReferralLabel;
      } else {
        this.organizationService.getOrganization(user.Organizations[0].Item2);
      }
    } else {
      this.router.navigate(['/login']);
    }

    // Subscribe to organization service events
    this.organizationService.subscribe((event: OrganizationServiceEvents) => {
      console.log('App component listening to event: ' + event);

      if (event === OrganizationServiceEvents.OrganizationReceived) {
        let orgData = this.cacheService.get(this.cacheKeys.Organization);
        let organization = JSON.parse(orgData);
        this.ReferralLabel = organization.ReferralLabel;
      }
    });

    this.EditingDetails = false;
    this.Organization = {};
    this.Organization.Groups = [];
    this.setTabs();

    switch (window.location.pathname) {
      case '/details':
        this.SetCurrentTab(TabItem.Details);
        break;
      case '/members':
        this.SetCurrentTab(TabItem.Members);
        break;
      case '/referrals':
        this.SetCurrentTab(TabItem.Referrals);
        break;
      case '/guests':
        this.SetCurrentTab(TabItem.Guests);
        break;
      case '/members/edit':
        this.SetCurrentTab(TabItem.AddMembers);
        break;
      default:
        this.SetCurrentTab(TabItem.Details);
    }
  }
}
