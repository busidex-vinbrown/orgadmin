import { Component, ViewChild, OnInit, AfterViewInit } from '@angular/core';
import { WysiwygComponent } from './wysiwyg.component';
import { OrganizationServiceComponent } from '../shared/organization.service';
import { CacheService, CacheKeys } from '../shared';
import { User, Organization, OrganizationServiceEvents } from '../shared/models';

declare var $: any;

@Component({
    selector: 'edit-message',
    providers: [],
    directives: [WysiwygComponent],
    pipes: [],
    styles: [require('./edit-message.component.scss')],
    templateUrl: './edit-message.component.html'
})
export class EditMessageComponent implements OnInit, AfterViewInit {
    @ViewChild('messageEditor') messageEditor;

    organization: Organization;
    loading: boolean;
    $messageEditor: Element;

    constructor(
        private organizationService: OrganizationServiceComponent,
        private cacheService: CacheService,
        private cacheKeys: CacheKeys) {

    }

    ngAfterViewInit(){
        this.$messageEditor = document.querySelector('.note-editor');
        this.getOrganizationData();
    }

    save() {
        this.loading = true;
        this.organization.HomePage = this.messageEditor.getRawHtml();
        this.organizationService.updateOrganization(this.organization);
    }

    private getOrganizationData() {
        let userData = this.cacheService.get(this.cacheKeys.User);
        let user: User = JSON.parse(userData);

        let orgId = user.Organizations[0].Item2;
        let orgData = this.cacheService.get(this.cacheKeys.Organization);
        if (orgData) {
            this.organization = JSON.parse(orgData);
            this.messageEditor.setRawHtml(this.organization.HomePage);

            this.loading = false;
        } else {
            this.loading = true;
            this.organizationService.getOrganization(orgId);
        }
    }

    ngOnInit() {

        

        this.organizationService.subscribe((event: OrganizationServiceEvents) => {
            console.log('Details component listening to event: ' + event);

            if (event === OrganizationServiceEvents.OrganizationUpdated) {
                this.getOrganizationData();
            }

            if (event === OrganizationServiceEvents.OrganizationReceived) {
                this.getOrganizationData();
            }
        });
    }
}