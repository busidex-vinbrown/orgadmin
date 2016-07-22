import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Rx';
import { Http, Headers } from '@angular/http';
import { CacheService, CacheKeys } from '../shared';
import { User } from '../shared/models';

const ROOT = 'https://www.busidexapi.com/api';

@Injectable()
export class OrganizationServiceComponent {

    constructor(private http: Http, private cacheService: CacheService, private cacheKeys: CacheKeys) {

    }

    private getUserToken(): string {
        let data = this.cacheService.get(this.cacheKeys.User);
        let user: User = JSON.parse(data);

        return (user !== null) ? user.Token : '';
    }

    getOrganization(id: number) {

        let headers = new Headers();
        headers.append('X-Authorization-Token', this.getUserToken());

        return this.http.get(ROOT + '/Organization/Get/' + id, { headers: headers });
    }

    getMembers(organizationId: number) {

        let headers = new Headers();
        headers.append('X-Authorization-Token', this.getUserToken());

        return this.http.get(ROOT + '/Organization/GetMembers/?organizationId=' + organizationId, { headers: headers });
    }

    getGuests(organizationId: number) {

        let headers = new Headers();
        headers.append('X-Authorization-Token', this.getUserToken());

        return this.http.get(ROOT + '/Organization/GetGuests/?organizationId=' + organizationId, { headers: headers });
    }

    getReferrals(organizationId: number) {

        let headers = new Headers();
        headers.append('X-Authorization-Token', this.getUserToken());

        return this.http.get(ROOT + '/Organization/GetReferrals/?organizationId=' + organizationId, { headers: headers });
    }

    cacheOrganizationData(data){
        data.Model.logo = data.Model.LogoFilePath + data.Model.LogoFileName + '.' +data.Model.LogoType;
        this.cacheService.put(this.cacheKeys.Organization, JSON.stringify(data.Model));
    }
}
