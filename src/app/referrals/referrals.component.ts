import { Component, OnInit, Input } from '@angular/core';
import { OrganizationServiceComponent } from '../shared/organization.service';
import { CacheService, CacheKeys } from '../shared';
import { Response } from '@angular/http';
import { User, Organization, OrganizationServiceEvents } from '../shared/models';
import { FilterPipe} from '../shared/filter-pipe';

@Component({
    selector: 'referrals',
    providers: [],
    directives: [],
    pipes: [FilterPipe],
    styles: [require('./referrals.component.scss')],
    templateUrl: './referrals.component.html'
})
export class ReferralsComponent implements OnInit {
    @Input() editMode: boolean;

    guests: any[];
    loading: boolean;
    referrals: any[];
    referralLabel: string;
    savingNotes: boolean[];
    filterExpression: string;

    constructor(
        private organizationService: OrganizationServiceComponent,
        private cacheService: CacheService,
        private cacheKeys: CacheKeys) {

    }

    removeReferral(card: any) {
        if (window.confirm('Are you sure you want to remove ' + card.Name || card.CompanyName + '?')) {
            this.organizationService.removeReferral(card.CardId);
        }
    }

    saveNotes(idx, card) {
        if (card.dirty) {
            this.savingNotes[idx] = true;
            this.organizationService.updateCardNotes(card.UserCardId, encodeURIComponent(card.Notes));
        }
    }

    goToDetails(cardId: number) {

    }

    private getReferrals(orgId: number) {
        let organizationData = this.cacheService.get(this.cacheKeys.Organization);
        let organization: Organization = JSON.parse(organizationData);

        this.referralLabel = organization.ReferralLabel;

        this.organizationService.getReferrals(orgId)
            .map((res: Response) => res.json())
            .subscribe(
            data2 => {

                this.referrals = [];

                this.savingNotes = [];
                for (let i = 0; i < data2.Model.length; i++) {
                    let card = data2.Model[i].Card;
                    card.UserCardId = data2.Model[i].UserCardId;
                    card.imgSrc = 'https://az381524.vo.msecnd.net/cards/' + card.FrontFileId + '.' + card.FrontType;
                    card.emailLink = 'mailto:' + card.Email;
                    card.Notes = decodeURIComponent(data2.Model[i].Notes);
                    if (card.Notes === 'null') {
                        card.Notes = '';
                    }
                    card.dirty = false;
                    this.referrals.push(card);

                }
                this.initControls();
                this.cacheService.put(this.cacheKeys.Referrals, JSON.stringify(this.referrals));
                this.loading = false;
            },
            err => console.error(err),
            () => console.log('done')
            );
    }

    initControls() {
        this.savingNotes = [];
        for (let i = 0; i < this.referrals.length; i++) {
            this.savingNotes.push(false);
        }
    }

    ngOnInit() {

        this.filterExpression = '';
        
        let userData = this.cacheService.get(this.cacheKeys.User);
        let user: User = JSON.parse(userData);
        let orgId = user.Organizations[0].Item2;

        this.loading = true;

        let referralData = this.cacheService.get(this.cacheKeys.Referrals);
        if (referralData) {
            this.referrals = JSON.parse(referralData);
            this.initControls();
            this.loading = false;
        } else {
            this.organizationService.getOrganization(orgId);
        }

        // Subscribe to organization service events
        this.organizationService.subscribe((event: OrganizationServiceEvents) => {
            console.log('Referral component listening to event: ' + event);

            if (event === OrganizationServiceEvents.ReferralsUpdated) {
                this.referrals = [];
                this.getReferrals(orgId);
            }

            if (event === OrganizationServiceEvents.OrganizationReceived) {
                this.getReferrals(orgId);
            }
        });
    }
}
