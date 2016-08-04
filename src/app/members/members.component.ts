import { Component, OnInit, Input } from '@angular/core';
import { OrganizationServiceComponent } from '../shared/organization.service';
import { ROUTER_DIRECTIVES } from '@angular/router';
import { Response } from '@angular/http';
import { CacheService, CacheKeys } from '../shared';
import { User, ServiceEvents } from '../shared/models';
import { FilterPipe} from '../shared/filter-pipe';

@Component({
  selector: 'members',
  providers: [],
  directives: [...ROUTER_DIRECTIVES],
  pipes: [FilterPipe],
  styles: [require('./members.component.scss')],
  templateUrl: './members.component.html'
})
export class MembersComponent implements OnInit {
  @Input() editMode: boolean;

  searchFilter: any;
  showSelectedOnly: boolean;
  organization: any;
  loading: boolean;
  organizationId: number;
  filterExpression: string;
  hasMembers: boolean;

  constructor(
    private organizationService: OrganizationServiceComponent,
    private cacheService: CacheService,
    private cacheKeys: CacheKeys) {

  }

  private getMembers(orgId: number) {

    let orgData = this.cacheService.get(this.cacheKeys.Organization);
    this.organization = JSON.parse(orgData);

    let memberData = this.cacheService.get(this.cacheKeys.Members);
    if (memberData) {
      this.organization.Cards = JSON.parse(memberData);
      this.hasMembers = this.organization.Cards.length > 0;
      this.loading = false;
    } else {
      this.loading = true;
      this.organizationService.getMembers(orgId);
    }
  }

  removeMember(cardId: number) {
    if (window.confirm('Are you sure you want to remove this member?')) {
      this.organizationService.removeMember(this.organizationId, cardId);
    }
  }

  ngOnInit() {

    this.filterExpression = '';

    let userData = this.cacheService.get(this.cacheKeys.User);
    let user: User = JSON.parse(userData);
    let orgId = JSON.parse(this.cacheService.get(this.cacheKeys.CurrentOrganization));

    if (user.StartPage === 'Organization' && orgId === null) {
      orgId = user.Organizations[0].Item2;
      this.cacheService.put(this.cacheKeys.CurrentOrganization, orgId);
    }

    this.organizationId = orgId;

    this.loading = true;
    let orgData = this.cacheService.get(this.cacheKeys.Organization);
    if (orgData) {
      this.organization = JSON.parse(orgData);
      this.getMembers(orgId);
    } else {
      this.organizationService.getOrganization(orgId);
    }

    // Subscribe to organization service events
    this.organizationService.subscribe((event: ServiceEvents) => {

      switch (event) {
        case ServiceEvents.MembersUpdated: {
          this.getMembers(orgId);
          break;
        }
        case ServiceEvents.OrganizationReceived: {
          this.getMembers(orgId);
          break;
        }
      }
    });
  }
}
