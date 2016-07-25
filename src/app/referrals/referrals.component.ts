import { Component, OnInit, Input } from '@angular/core';
import { OrganizationServiceComponent } from '../shared/organization.service';
import { CacheService, CacheKeys } from '../shared';
import { Response } from '@angular/http';
import { User, Organization, OrganizationServiceEvents } from '../shared/models';

@Component({
    selector: 'referrals',
    providers: [],
    directives: [],
    pipes: [],
    styles: [require('./referrals.component.scss')],
    templateUrl: './referrals.component.html'
})
export class ReferralsComponent implements OnInit {
    @Input() editMode: boolean;

    guests: any[];
    loading: boolean;
    referrals: any[];
    referralLabel: string;

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

                for (let i = 0; i < data2.Model.length; i++) {
                    let card = data2.Model[i].Card;
                    card.imgSrc = 'https://az381524.vo.msecnd.net/cards/' + card.FrontFileId + '.' + card.FrontType;
                    card.emailLink = 'mailto:' + card.Email;
                    card.Notes = decodeURIComponent(data2.Model[i].Notes);
                    if (card.Notes === 'null') {
                        card.Notes = '';
                    }
                    this.referrals.push(card);
                }

                this.cacheService.put(this.cacheKeys.Referrals, JSON.stringify(this.referrals));
                this.loading = false;
            },
            err => console.error(err),
            () => console.log('done')
            );
    }

    ngOnInit() {

        let userData = this.cacheService.get(this.cacheKeys.User);
        let user: User = JSON.parse(userData);
        let orgId = user.Organizations[0].Item2;

        this.loading = true;

        let referralData = this.cacheService.get(this.cacheKeys.Referrals);
        if (referralData) {
            this.referrals = JSON.parse(referralData);

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
