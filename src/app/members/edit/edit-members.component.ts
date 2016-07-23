import { Component, OnInit } from '@angular/core';
import { OrganizationServiceComponent } from '../../shared/organization.service';
import { Response } from '@angular/http';
import { CacheService, CacheKeys, SearchServiceComponent } from '../../shared';
import { User } from '../../shared/models';
import { MembersComponent } from '../members.component';

require('bootstrap');

@Component({
  selector: 'edit-members',
  providers: [],
  directives: [MembersComponent],
  pipes: [],
  styles: [require('./edit-members.component.scss')],
  templateUrl: './edit-members.component.html'
})
export class EditMembersComponent implements OnInit {

  searchFilter: any;
  showSelectedOnly: boolean;
  organization: any;
  loading: boolean;
  searching: boolean;
  searchResults: any[];
  criteria: string;
  user: User;
  existingCards: any[];

  constructor(
    private organizationService: OrganizationServiceComponent,
    private searchService: SearchServiceComponent,
    private cacheService: CacheService,
    private cacheKeys: CacheKeys) {


  }

  handleKeyPress(key){
    if(key.keyCode === 13){
      this.doSearch();
    }
  }

  toggle(card: any){
    for(let i=0; i< this.searchResults.length; i++){
      if(this.searchResults[i].CardId === card.CardId){
        this.searchResults[i].selected = !this.searchResults[i].selected;
      }
    }
  }

  deselect(card: any){
    for(let i=0; i< this.searchResults.length; i++){
      if(this.searchResults[i].CardId === card.CardId){
        this.searchResults[i].selected = false;
      }
    }
  }

  doSearch() {

    if(this.searchResults.length > 0){
      this.clearSearch();
    }

    let model = {
      UserId: this.user.UserId,
      Criteria: this.criteria,
      SearchText: this.criteria,
      CardType: 1,
      Distance: 25
    };
    
    this.searching = true;

    this.searchService.post(model)
      .map((res: Response) => res.json())
      .subscribe((results) => {
        this.searchResults = [];

        let memberData = this.cacheService.get(this.cacheKeys.Members);
        this.existingCards = JSON.parse(memberData);

        for (let j = 0; j < results.SearchModel.Results.length; j++) {

          let modelCard = results.SearchModel.Results[j];
          modelCard.FrontOrientationClass = modelCard.FrontOrientation == 'V' ? 'v_preview' : 'h_preview';

          for (let c = 0; c < this.existingCards.length; c++) {

            modelCard.IsMember = false;
            let link = 'https://az381524.vo.msecnd.net/cards/' + modelCard.FrontFileId + '.' + modelCard.FrontType;
            modelCard.imgSrc = link;
            if (this.existingCards[c].CardId == modelCard.CardId) {

              modelCard.IsMember = true;
              break;
            }
          }
          this.searchResults.push(modelCard);
        }

        this.searching = false;
      });
  }

  clearSearch() {
    this.criteria = '';
    this.searchResults = [];
  }
  ngOnInit() {
    this.searchResults = [];

    let userData = this.cacheService.get(this.cacheKeys.User);
    this.user = JSON.parse(userData);
  }
}
