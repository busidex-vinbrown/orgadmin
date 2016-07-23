import { Component, OnInit } from '@angular/core';
import { OrganizationServiceComponent } from '../../shared/organization.service';
import { Response } from '@angular/http';
import { CacheService, CacheKeys } from '../../shared';
import { User } from '../../shared/models';
import { MembersComponent } from '../members.component';
//import '../../../styles/font-awesome.scss';

@Component({
  selector: 'edit-members',
  providers: [],
  directives: [ MembersComponent ],
  pipes: [],
  styles: [require('./edit-members.component.scss'), require('../../../styles/font-awesome.scss')],
  templateUrl: './edit-members.component.html'
})
export class EditMembersComponent implements OnInit {

  searchFilter: any;
  showSelectedOnly: boolean;
  organization: any;
  loading: boolean;
  
  constructor(
    private organizationService: OrganizationServiceComponent,
    private cacheService: CacheService,
    private cacheKeys: CacheKeys) {

  }

  doSearch(){

  }

  ngOnInit(){

  }
}
