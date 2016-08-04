import { Component, OnInit } from '@angular/core';
import { ROUTER_DIRECTIVES, Router } from '@angular/router';
import { TabItem } from './tab.enum';
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
  Tabs: any;
  TabItems: any;
  Organization: any;
  EditingDetails: boolean;
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
    this.user = JSON.parse(data);
    this.loggedIn = this.user !== null;
    let orgId = JSON.parse(this.cacheService.get(this.cacheKeys.CurrentOrganization));

    if (this.loggedIn) {
      let orgData = this.cacheService.get(this.cacheKeys.Organization);
      if (orgData) {
        let organization: Organization = JSON.parse(orgData);
        this.ReferralLabel = organization.ReferralLabel;
        orgId = organization.OrganizationId;
      } else {
        if (this.user !== null && this.user.StartPage === 'Organization' && orgId === null) {
          orgId = this.user.Organizations[0].Item2;
          this.cacheService.put(this.cacheKeys.CurrentOrganization, orgId);
        }
        this.organizationService.getOrganization(orgId);
      }

      this.isAdmin = this.user.StartPage === 'Organization' && orgId === this.user.Organizations[0].Item2;
      console.log('IsAdmin is ', this.isAdmin);
      
    } else {
      this.router.navigate(['/login']);
    }

    // Subscribe to organization service events
    this.organizationService.subscribe((event: ServiceEvents) => {

      if (event === ServiceEvents.OrganizationReceived) {
        let orgData = this.cacheService.get(this.cacheKeys.Organization);
        let organization: Organization = JSON.parse(orgData);
        this.ReferralLabel = organization.ReferralLabel;
        this.isAdmin = this.user.StartPage === 'Organization' && organization.OrganizationId === this.user.Organizations[0].Item2;
      }

      if(event === ServiceEvents.UserLoggedIn){
        let data = this.cacheService.get(this.cacheKeys.User) || null;
        this.user = JSON.parse(data);
        this.isAdmin = this.user.StartPage === 'Organization' && orgId === this.user.Organizations[0].Item2;
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
      case '/details/edit':
        this.SetCurrentTab(TabItem.EditDetails);
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
      case '/referrals/edit':
        this.SetCurrentTab(TabItem.AddReferrals);
        break;
      case '/edit-message':
        this.SetCurrentTab(TabItem.HomePage);
        break;
      default:
        console.log('Using default route for ', window.location.pathname);
        this.SetCurrentTab(TabItem.Details);
    }
  }
}
