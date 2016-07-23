import { Injectable, EventEmitter } from '@angular/core';
import { Http, Headers, Response, ResponseOptions } from '@angular/http';
import { CacheService, CacheKeys, BaseService } from '../shared';
import { OrganizationServiceEvents } from '../shared/models';

const ROOT = 'https://www.busidexapi.com/api';

@Injectable()
export class OrganizationServiceComponent extends BaseService {

    constructor(protected http: Http, protected cacheService: CacheService, protected cacheKeys: CacheKeys) {
        super(http, cacheService, cacheKeys);
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

    addMembers(organizationId: number, cardId: number) {
        let headers = new Headers();
        let token = this.getUserToken();
        headers.append('X-Authorization-Token', token);
        //console.log('adding members. userToken: ' + token)
        headers.append('Content-Type', 'application/json');

        let url = ROOT + '/Organization/AddOrganizationCard?organizationId=' + organizationId + '&cardId=' + cardId;
        this.http.post(url, {}, { headers: headers })
            .subscribe((response: Response) => {

                this.cacheService.put(this.cacheKeys.Members, null);
                console.log('Broadcasting event: ' + OrganizationServiceEvents.MembersUpdated);
                this.emit(OrganizationServiceEvents.MembersUpdated);
                return response;
            });
    }



    cacheOrganizationData(data) {
        data.Model.logo = data.Model.LogoFilePath + data.Model.LogoFileName + '.' + data.Model.LogoType;
        this.cacheService.put(this.cacheKeys.Organization, JSON.stringify(data.Model));
    }
}
