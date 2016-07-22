import { Component, OnInit } from '@angular/core';
import { OrganizationServiceComponent } from '../shared/organization.service';
import { Response } from '@angular/http';
import { CacheService, CacheKeys } from '../shared';
import { User } from '../shared/models';

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
      var orgData = this.cacheService.get(this.cacheKeys.Organization);
      if (orgData) {
        this.organization = JSON.parse(orgData);
        this.emailLink = 'mailto:' + this.organization.Email;
        this.organization.logo = this.organization.LogoFilePath + this.organization.LogoFileName + '.' + this.organization.LogoType;
      } else {
        this.loading = true;
        this.organizationService.getOrganization(orgId)
          .map((res: Response) => res.json())
          .subscribe(
          data => {
            this.organization = data.Model;
            this.emailLink = 'mailto:' + data.Model.Email;
            this.organization.logo = data.Model.LogoFilePath + data.Model.LogoFileName + '.' + data.Model.LogoType;
            this.loading = false;
          },
          err => console.error(err),
          () => console.log('done')
          );
      }
    } else {
      if (window.location.href.indexOf('localhost') >= 0) {
        window.location.href = '/login';
      } else {
        window.location.href = 'https://www.busidex.com';
      }
    }
  }
}
