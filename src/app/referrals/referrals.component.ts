import { Component, OnInit, Input } from '@angular/core';
import { OrganizationServiceComponent } from '../shared/organization.service';
import { CacheService, CacheKeys } from '../shared';
import { Response } from '@angular/http';
import { User, Organization, ServiceEvents } from '../shared/models';
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
        let _referrals = JSON.parse(this.cacheService.get(this.cacheKeys.Referrals));

        this.referralLabel = organization.ReferralLabel;

        if (_referrals === null) {
            this.loading = true;
            this.organizationService.getReferrals(orgId);
        } else {
            this.referrals = _referrals;
            this.initControls();
            this.loading = false;
        }
    }

    initControls() {
        if (this.editMode) {
            this.savingNotes = [];
            this.referrals = this.referrals || [];
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
        this.organizationService.subscribe((event: ServiceEvents) => {

            switch (event) {
                case ServiceEvents.ReferralsUpdated: {
                    this.getReferrals(orgId);
                    break;
                }

                case ServiceEvents.OrganizationReceived: {
                    this.getReferrals(orgId);
                    break;
                }
            }
        });
    }
}
