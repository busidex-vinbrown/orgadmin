import { Component, OnInit } from '@angular/core';
import { OrganizationServiceComponent } from '../../shared/organization.service';
import { CacheService, CacheKeys } from '../../shared';
import { User, OrganizationServiceEvents, Organization, Visibility } from '../../shared/models';


@Component({
    selector: 'edit-details',
    providers: [],
    directives: [],
    pipes: [],
    styles: [require('./edit-details.component.scss')],
    templateUrl: './edit-details.component.html'
})
export class EditDetailsComponent implements OnInit {

    organization: Organization;
    emailLink: string;
    loading: boolean;
    saving: boolean;
    isPrivate: boolean;

    constructor(
        private organizationService: OrganizationServiceComponent,
        private cacheService: CacheService,
        private cacheKeys: CacheKeys) {

    }

    save() {
        
        this.saving = true;
        this.organization.Visibility = this.isPrivate ? Visibility.Private : Visibility.Public;

        this.organizationService.updateOrganization(this.organization);
    }

    ngOnInit() {

        this.saving = false;
        let userData = this.cacheService.get(this.cacheKeys.User);
        let user: User = JSON.parse(userData);

        let orgId = user.Organizations[0].Item2;
        let orgData = this.cacheService.get(this.cacheKeys.Organization);
        if (orgData) {
            this.organization = JSON.parse(orgData);
            this.emailLink = 'mailto:' + this.organization.Email;
        } else {
            this.loading = true;
            this.organizationService.getOrganization(orgId);
        }

        // Subscribe to organization service events
        this.organizationService.subscribe((event: OrganizationServiceEvents) => {
            console.log('EditDetails component listening to event: ' + event);

            if (event === OrganizationServiceEvents.OrganizationUpdated) {
                orgData = this.cacheService.get(this.cacheKeys.Organization);
                this.organization = JSON.parse(orgData);
                if (this.organization === null) {
                    this.saving = this.loading = true;
                    this.organization = {
                        AdminEmail: '',
                        Contacts: '',
                        Created: '',
                        Deleted: false,
                        Description: '',
                        Email: '',
                        Extension1: '',
                        Extension2: '',
                        Facebook: '',
                        Groups: '',
                        HomePage: '',
                        IsMember: false,
                        Logo: '',
                        LogoFileName: '',
                        LogoFilePath: '',
                        LogoType: '',
                        Name: '',
                        OrganizationId: 0,
                        Phone1: '',
                        Phone2: '',
                        ReferralLabel: '',
                        Twitter: '',
                        Updated: '',
                        Url: '',
                        UserId: 0,
                        Visibility: 0
                    };
                    this.organizationService.getOrganization(orgId);
                } else {
                    this.emailLink = 'mailto:' + this.organization.Email;
                    this.saving = this.loading = false;
                }
            }

            if (event === OrganizationServiceEvents.OrganizationReceived) {
                orgData = this.cacheService.get(this.cacheKeys.Organization);
                this.organization = JSON.parse(orgData);
                this.emailLink = 'mailto:' + this.organization.Email;
                this.saving = this.loading = false;
                this.isPrivate = this.organization.Visibility === Visibility.Private ? true : false;
            }
        });
    }
}
