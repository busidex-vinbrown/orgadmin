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

  handleKeyPress(key) {
    if (key.keyCode === 13) {
      this.doSearch();
    }
  }

  toggle(card: any) {
    for (let i = 0; i < this.searchResults.length; i++) {
      if (this.searchResults[i].CardId === card.CardId) {
        this.searchResults[i].selected = !this.searchResults[i].selected;
      }
    }
  }

  /**
   * addSelected()
   * This method takes the selected cards from the search result and adds them
   * to the collection of members. The api will remove the card from the referrals
   * if it was there, so this method also pulls the fresh list of referrals from the
   * api and updates the local cache.
   */
  addSelected() {

    let orgId = this.user.Organizations[0].Item2;

    for (let i = 0; i < this.searchResults.length; i++) {

      let card = this.searchResults[i];
      if (card.selected) {
        this.existingCards.push(card);
        this.searchResults.splice(i);

        this.organizationService.addMembers(orgId, card.CardId);
      }

    }

    // update the local cache for Members
    this.cacheService.put(this.cacheKeys.Members, JSON.stringify(this.existingCards));

    // invalidate the local cache for Referrals so it gets pulled fresh next time
    this.cacheService.put(this.cacheKeys.Referrals, null);

    this.clearSearch();
  }

  /**
   * doSearch()
   * This method will search for all cards matching a selected critiria. It only displays the cards
   * that are not already in the collection of members. Distance is included in the parameter list,
   * but at this time it is not used. That was intended to limit the search to a radius of x miles. This
   * feature has not been implemented on the server, so this is just a placeholder until such time as it 
   * is used. 
   */
  doSearch() {

    if (this.searchResults.length > 0) {
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
          modelCard.FrontOrientationClass = modelCard.FrontOrientation === 'V' ? 'v_preview' : 'h_preview';
          let link = 'https://az381524.vo.msecnd.net/cards/' + modelCard.FrontFileId + '.' + modelCard.FrontType;
          modelCard.imgSrc = link;

          // check if this card already exists in the organization
          for (let c = 0; c < this.existingCards.length; c++) {

            modelCard.IsMember = false;

            if (this.existingCards[c].CardId === modelCard.CardId) {
              modelCard.IsMember = true;
              break;
            }
          }

          // only add them to the search results if they're not a member
          if (!modelCard.IsMember) {
            this.searchResults.push(modelCard);
          }
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
