import { Component, OnInit, Input } from '@angular/core';
import { OrganizationServiceComponent } from '../shared/organization.service';
import { ROUTER_DIRECTIVES } from '@angular/router';
import { Response } from '@angular/http';
import { CacheService, CacheKeys } from '../shared';
import { User, OrganizationServiceEvents } from '../shared/models';
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

  constructor(
    private organizationService: OrganizationServiceComponent,
    private cacheService: CacheService,
    private cacheKeys: CacheKeys) {

  }

  private getMembers(orgId: number) {

    let memberData = this.cacheService.get(this.cacheKeys.Members);
    if (memberData) {
      this.organization.Cards = JSON.parse(memberData);
      this.loading = false;
    } else {
      this.organizationService.getMembers(orgId)
        .map((res: Response) => res.json())
        .subscribe(
        cards => {
          this.organization.Cards = [];
          for (let i = 0; i < cards.Model.length; i++) {
            let card = cards.Model[i];
            let link = 'https://az381524.vo.msecnd.net/cards/' + card.FrontFileId + '.' + card.FrontType;
            card.imgSrc = link;
            card.Url = card.Url || '';
            card.Url = card.Url.replace('https://', '').replace('http://', '');
            if (card.Url.length > 0) {
              card.Url = 'http://' + card.Url;
            }
            this.organization.Cards.push(card);
          }
          this.cacheService.put(this.cacheKeys.Members, JSON.stringify(this.organization.Cards));
          this.loading = false;
        },
        err => console.error(err),
        () => console.log('done')
        );
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
    this.organizationService.subscribe((event: OrganizationServiceEvents) => {
      console.log('Members component listening to event: ' + event);
      if (event === OrganizationServiceEvents.MembersUpdated) {
        this.organization.Cards = [];
        this.getMembers(orgId);
      }
      if (event === OrganizationServiceEvents.OrganizationReceived) {
        orgData = this.cacheService.get(this.cacheKeys.Organization);
        this.organization = JSON.parse(orgData);
        this.getMembers(orgId);
      }
    });
  }
}
