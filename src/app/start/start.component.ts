import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { ServiceEvents } from '../shared/models';
import { OrganizationServiceComponent } from '../shared/organization.service';
import { CacheService, CacheKeys } from '../shared';


@Component({
    selector: 'start',
    providers: [],
    directives: [],
    pipes: [],
    styles: [],
    template: ` `
})
export class StartComponent implements OnInit, OnDestroy {

    constructor(
        private cacheService: CacheService,
        private cacheKeys: CacheKeys,
        private router: Router,
        private route: ActivatedRoute,
        private organizationService: OrganizationServiceComponent
    ) {

    }

    ngOnDestroy() {
        // this.organizationService.unsubscribe();
    }

    ngOnInit() {

        this.route.params.subscribe(params => {

            let user = this.cacheService.get(this.cacheKeys.User);
            if (user === null) {
                window.location.href = 'https://www.busidex.com/#/login';
                return;
            } else {
                this.cacheService.nuke();
                this.cacheService.put(this.cacheKeys.User, JSON.stringify(user));
            }

            let orgId = params['id'];
            if (orgId === undefined) {
                window.location.href = 'https://www.busidex.com';
                return;
            }

            this.cacheService.put(this.cacheKeys.CurrentOrganization, JSON.stringify(orgId));
            this.organizationService.getOrganization(orgId);
        });

        this.organizationService.subscribe((event: ServiceEvents) => {
            if (event === ServiceEvents.OrganizationReceived) {
                this.router.navigate(['details']);
            }
        });
    }
}
