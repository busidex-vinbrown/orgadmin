import { Component, OnInit } from '@angular/core';
import {OrganizationServiceComponent} from '../shared/organization.service';
import {Response} from '@angular/http';

@Component({
    selector: 'referrals',
    providers: [],
    directives: [],
    pipes: [],
    styles: [require('./referrals.component.scss')],
    templateUrl: './referrals.component.html'
})
export class ReferralsComponent implements OnInit {

    guests: any[];
    loading: boolean;
    referrals: any[];
    noReferralsMessage: string;

    constructor(private organizationService: OrganizationServiceComponent) {

    }

    ngOnInit() {

        let orgId = 12;
        this.loading = true;

        this.organizationService.getOrganization(12)
            .map((res: Response) => res.json())
            .subscribe(
            data => {
                console.log(data);
                this.noReferralsMessage = data.Model.ReferralLabel;

                this.organizationService.getReferrals(orgId)
                    .map((res: Response) => res.json())
                    .subscribe(
                    data2 => {

                        this.referrals = [];

                        for (let i = 0; i < data2.Model.length; i++) {
                            let card = data2.Model[i];
                            let link = 'https://az381524.vo.msecnd.net/cards/' + card.FrontFileId + '.' + card.FrontType;
                            card.imgSrc = link;
                            this.referrals.push(card);
                        }
                        this.loading = false;
                    },
                    err => console.error(err),
                    () => console.log('done')
                    );

            },
            err => console.error(err),
            () => console.log('app data loaded')
            );


    }
}
