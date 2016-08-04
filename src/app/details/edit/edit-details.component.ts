import { Component, OnInit } from '@angular/core';
import { OrganizationServiceComponent } from '../../shared/organization.service';
import { CacheService, CacheKeys } from '../../shared';
import { User, ServiceEvents, Organization, Visibility } from '../../shared/models';
import { FORM_DIRECTIVES, REACTIVE_FORM_DIRECTIVES, FormBuilder, FormGroup, AbstractControl } from '@angular/forms';

@Component({
    selector: 'edit-details',
    providers: [],
    directives: [FORM_DIRECTIVES, REACTIVE_FORM_DIRECTIVES],
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
    detailsForm: FormGroup;

    constructor(
        private organizationService: OrganizationServiceComponent,
        private cacheService: CacheService,
        private cacheKeys: CacheKeys,
        private formBuilder: FormBuilder) {

        this.resetForm();

    }

    resetForm() {

        this.detailsForm = this.formBuilder.group({
            'name': this.organization ? this.organization.Name : '',
            'contacts': this.organization ? this.organization.Contacts : '',
            'email': this.organization ? this.organization.Email : '',
            'url': this.organization ? this.organization.Url : '',
            'phone1': this.organization ? this.organization.Phone1 : '',
            'phone2': this.organization ? this.organization.Phone2 : '',
            'twitter': this.organization ? this.organization.Twitter : '',
            'facebook': this.organization ? this.organization.Facebook : '',
            'isPrivate': this.isPrivate
        });
    }
    save() {
        this.saving = true;
        this.organization.Visibility = this.isPrivate ? Visibility.Private : Visibility.Public;

        this.organizationService.updateOrganization(this.organization);
        this.resetForm();
    }

    ngOnInit() {

        this.saving = false;
        let userData = this.cacheService.get(this.cacheKeys.User);
        let user: User = JSON.parse(userData);
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
        let orgId = user.Organizations[0].Item2;
        // let orgData = this.cacheService.get(this.cacheKeys.Organization);
        // if (orgData) {
        //     this.organization = JSON.parse(orgData);
        //     this.emailLink = 'mailto:' + this.organization.Email;
        //     this.isPrivate = (this.organization.Visibility === Visibility.Private) ? true : false;
        // } else {
        this.loading = true;
        this.organizationService.getOrganization(orgId);
        //}

        // Subscribe to organization service events
        this.organizationService.subscribe((event: ServiceEvents) => {

            if (event === ServiceEvents.OrganizationUpdated) {
                this.organizationService.getOrganization(orgId);
            }

            if (event === ServiceEvents.OrganizationReceived) {
                let orgData = this.cacheService.get(this.cacheKeys.Organization);

                this.organization = JSON.parse(orgData);

                this.isPrivate = this.organization.Visibility === Visibility.Private ? true : false;

                this.emailLink = 'mailto:' + this.organization.Email;
                this.saving = this.loading = false;
                this.resetForm();
            }
        });
    }
}
