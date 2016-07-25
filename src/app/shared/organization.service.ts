import { Injectable } from '@angular/core';
import { Http, Headers, Response } from '@angular/http';
import { CacheService, CacheKeys, BaseService } from '../shared';
import { OrganizationServiceEvents, Organization } from '../shared/models';

const ROOT = 'https://www.busidexapi.com/api';

@Injectable()
export class OrganizationServiceComponent extends BaseService {

    constructor(protected http: Http, protected cacheService: CacheService, protected cacheKeys: CacheKeys) {
        super(http, cacheService, cacheKeys);
    }

    getOrganization(id: number) {

        let headers = new Headers();
        headers.append('X-Authorization-Token', this.getUserToken());

        this.http.get(ROOT + '/Organization/Get/' + id, { headers: headers })
            .map((res: Response) => res.json())
            .subscribe((data) => {

                this.cacheService.put(this.cacheKeys.Organization, JSON.stringify(data.Model));
                this.emit(OrganizationServiceEvents.OrganizationReceived);

            });
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

    addMember(organizationId: number, cardId: number) {
        let headers = new Headers();
        let token = this.getUserToken();
        headers.append('X-Authorization-Token', token);

        headers.append('Content-Type', 'application/json');

        let url = ROOT + '/Organization/AddOrganizationCard?organizationId=' + organizationId + '&cardId=' + cardId;
        this.http.post(url, {}, { headers: headers })
            .subscribe((response: Response) => {

                this.cacheService.put(this.cacheKeys.Members, null);

                this.emit(OrganizationServiceEvents.MembersUpdated);
                return response;
            });
    }

    removeMember(organizationId: number, cardId: number) {
        let headers = new Headers();
        let token = this.getUserToken();
        headers.append('X-Authorization-Token', token);

        headers.append('Content-Type', 'application/json');

        let url = ROOT + '/Organization/DeleteOrganizationCard?organizationId=' + organizationId + '&cardId=' + cardId;
        this.http.delete(url, { headers: headers })
            .subscribe((response: Response) => {

                this.cacheService.put(this.cacheKeys.Members, null);

                this.emit(OrganizationServiceEvents.MembersUpdated);
                return response;
            });
    }

    addReferral(cardId: number) {
        let headers = new Headers();
        let token = this.getUserToken();
        headers.append('X-Authorization-Token', token);

        headers.append('Content-Type', 'application/json');

        // don't send userId as a parameter. The server validates the userId from the token in the header.
        let url = ROOT + '/Busidex/Post?userId=0' + '&cId=' + cardId;
        this.http.post(url, {}, { headers: headers })
            .subscribe((response: Response) => {

                this.cacheService.put(this.cacheKeys.Members, null);

                this.emit(OrganizationServiceEvents.ReferralsUpdated);
                return response;
            });
    }

    removeReferral(cardId: number) {
        let headers = new Headers();
        let token = this.getUserToken();
        headers.append('X-Authorization-Token', token);

        headers.append('Content-Type', 'application/json');

        // don't send userId as a parameter. The server validates the userId from the token in the header.
        let url = ROOT + '/Busidex/Delete?id=' + cardId + '&userId=0';
        this.http.delete(url, { headers: headers })
            .subscribe((response: Response) => {

                this.cacheService.put(this.cacheKeys.Referrals, null);

                this.emit(OrganizationServiceEvents.ReferralsUpdated);
                return response;
            });
    }

    updateOrganization(organization: Organization) {
        let headers = new Headers();
        let token = this.getUserToken();
        headers.append('X-Authorization-Token', token);
        headers.append('Content-Type', 'application/json');

        // don't send userId as a parameter. The server validates the userId from the token in the header.
        let url = ROOT + '/Organization/Update';
        this.http.put(url, organization, { headers: headers })
            .subscribe((response: Response) => {

                this.cacheService.put(this.cacheKeys.Organization, null);

                this.emit(OrganizationServiceEvents.OrganizationUpdated);
                return response;
            });
    }

    cacheOrganizationData(data) {
        this.cacheService.put(this.cacheKeys.Organization, JSON.stringify(data.Model));
    }
}
