import { Component, OnInit } from '@angular/core';
import { OrganizationServiceComponent } from '../shared/organization.service';
import { ROUTER_DIRECTIVES } from '@angular/router';
import { Response } from '@angular/http';
import { CacheService, CacheKeys } from '../shared';
import { User, OrganizationServiceEvents } from '../shared/models';

@Component({
  selector: 'members',
  providers: [],
  directives: [...ROUTER_DIRECTIVES],
  pipes: [],
  styles: [require('./members.component.scss')],
  templateUrl: './members.component.html'
})
export class MembersComponent implements OnInit {

  searchFilter: any;
  showSelectedOnly: boolean;
  organization: any;
  loading: boolean;

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

  ngOnInit() {

    let userData = this.cacheService.get(this.cacheKeys.User);
    let user: User = JSON.parse(userData);
    let orgId = user.Organizations[0].Item2;

    this.loading = true;
    let orgData = this.cacheService.get(this.cacheKeys.Organization);
    if (orgData) {
      this.organization = JSON.parse(orgData);
      this.getMembers(orgId);
    } else {
      this.organizationService.getOrganization(orgId)
        .map((res: Response) => res.json())
        .subscribe(
        data => {

          this.organizationService.cacheOrganizationData(data);
          orgData = this.cacheService.get(this.cacheKeys.Organization);
          this.organization = JSON.parse(orgData);
          this.getMembers(orgId);
        },
        err => console.error(err),
        () => { }
        );
    }

    // Subscribe to organization service events
    this.organizationService.subscribe((event: OrganizationServiceEvents) => {
      console.log('Listening to event: ' + event);
      if (event === OrganizationServiceEvents.MembersUpdated) {
        console.log('Event found! updating members...');
        this.organization.Cards = [];
        this.getMembers(orgId);
      }
    });
  }
}
