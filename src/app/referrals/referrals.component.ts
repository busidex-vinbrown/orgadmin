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
    organization: any;
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

    private getReferrals(orgId: number) {
        let organizationData = this.cacheService.get(this.cacheKeys.Organization);
        let organization: Organization = JSON.parse(organizationData);

        this.referralLabel = organization.ReferralLabel;

        this.referrals = JSON.parse(this.cacheService.get(this.cacheKeys.Referrals));

        if (this.referrals === null) {
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
                        card.Url = card.Url || '';
                        card.Url = card.Url.replace('https://', '').replace('http://', '');
                        if (card.Url.length > 0) {
                            card.Url = 'http://' + card.Url;
                        }
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
        } else {
            this.loading = false;
            this.initControls();
        }
    }

    initControls() {
        if (this.editMode) {
            this.savingNotes = [];
            for (let i = 0; i < this.referrals.length; i++) {
                this.savingNotes.push(false);
            }
        }
    }

    ngOnInit() {

        console.log('loading referrals...');

        this.savingNotes = this.referrals = [];

        this.filterExpression = '';

        let userData = this.cacheService.get(this.cacheKeys.User);
        let user: User = JSON.parse(userData);
        let orgId = JSON.parse(this.cacheService.get(this.cacheKeys.CurrentOrganization));

        if (user.StartPage === 'Organization' && orgId === null) {
            orgId = user.Organizations[0].Item2;
            this.cacheService.put(this.cacheKeys.CurrentOrganization, orgId);
        }

        this.loading = true;

        let orgData = this.cacheService.get(this.cacheKeys.Organization);
        if (orgData) {
            this.organization = JSON.parse(orgData);
            this.getReferrals(orgId);
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
