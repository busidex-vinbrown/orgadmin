import { Injectable } from '@angular/core';
import { Http, Headers, Response } from '@angular/http';
import { CacheService, CacheKeys, BaseService } from '../shared';
import { ServiceEvents, Organization } from '../shared/models';

const ROOT = 'https://www.busidexapi.com/api';

@Injectable()
export class OrganizationServiceComponent extends BaseService {

    constructor(protected http: Http, protected cacheService: CacheService, protected cacheKeys: CacheKeys) {
        super(http, cacheService, cacheKeys);
    }

    private getHeaders() {
        let headers = new Headers();
        let token: string = this.getUserToken();

        headers.append('X-Authorization-Token', token);
        headers.append('Content-Type', 'application/json');
        return headers
    }

    getOrganization(id: number) {

        let headers = this.getHeaders();

        this.http.get(ROOT + '/Organization/Get/' + id, { headers: headers })
            .map((res: Response) => res.json())
            .subscribe((data) => {
                this.cacheService.put(this.cacheKeys.Organization, JSON.stringify(data.Model));
                this.emit(ServiceEvents.OrganizationReceived);
            });
    }

    getMembers(organizationId: number) {

        let headers = this.getHeaders();

        this.http.get(ROOT + '/Organization/GetMembers/?organizationId=' + organizationId, { headers: headers })
            .map((res: Response) => res.json())
            .subscribe(
            cards => {

                let members: any[] = [];

                for (let i = 0; i < cards.Model.length; i++) {
                    let card = cards.Model[i];
                    let link = 'https://az381524.vo.msecnd.net/cards/' + card.FrontFileId + '.' + card.FrontType;
                    card.imgSrc = link;
                    card.Url = card.Url || '';
                    card.Url = card.Url.replace('https://', '').replace('http://', '');
                    if (card.Url.length > 0) {
                        card.Url = 'http://' + card.Url;
                    }
                    if (card.email !== null) {
                        card.emailLink = 'mailto: ' + card.Email;
                    }

                    members.push(card);
                }
                this.cacheService.put(this.cacheKeys.Members, JSON.stringify(members));
                this.emit(ServiceEvents.MembersUpdated);
            });
    }

    getGuests(organizationId: number) {

        let headers = new Headers();
        headers.append('X-Authorization-Token', this.getUserToken());

        return this.http.get(ROOT + '/Organization/GetGuests/?organizationId=' + organizationId, { headers: headers });

    }

    getReferrals(organizationId: number) {

        let headers = this.getHeaders();

        this.http.get(ROOT + '/Organization/GetReferrals/?organizationId=' + organizationId, { headers: headers })
            .map((res: Response) => res.json())
            .subscribe((data) => {
                data.Model = data.Model || [];

                let referrals: any[] = [];

                for (let i = 0; i < data.Model.length; i++) {
                    let card = data.Model[i].Card;
                    card.UserCardId = data.Model[i].UserCardId;
                    card.imgSrc = 'https://az381524.vo.msecnd.net/cards/' + card.FrontFileId + '.' + card.FrontType;
                    card.Url = card.Url || '';
                    card.Url = card.Url.replace('https://', '').replace('http://', '');
                    if (card.Url.length > 0) {
                        card.Url = 'http://' + card.Url;
                    }
                    card.emailLink = 'mailto:' + card.Email;
                    card.Notes = decodeURIComponent(data.Model[i].Notes);
                    if (card.Notes === 'null') {
                        card.Notes = '';
                    }
                    card.dirty = false;
                    referrals.push(card);
                }

                this.cacheService.put(this.cacheKeys.Referrals, JSON.stringify(referrals));
                this.emit(ServiceEvents.ReferralsUpdated);
            });
    }

    addMember(organizationId: number, cardId: number) {
        let headers = this.getHeaders();

        let url = ROOT + '/Organization/AddOrganizationCard?organizationId=' + organizationId + '&cardId=' + cardId;
        this.http.post(url, {}, { headers: headers })
            .subscribe((response: Response) => {

                this.cacheService.put(this.cacheKeys.Members, null);

                this.emit(ServiceEvents.MembersUpdated);
                return response;
            });
    }

    removeMember(organizationId: number, cardId: number) {
        let headers = this.getHeaders();

        let url = ROOT + '/Organization/DeleteOrganizationCard?organizationId=' + organizationId + '&cardId=' + cardId;
        this.http.delete(url, { headers: headers })
            .subscribe((response: Response) => {
                this.cacheService.put(this.cacheKeys.Members, null);
                this.emit(ServiceEvents.MembersUpdated);
            });
    }

    addReferral(cardId: number) {
        let headers = this.getHeaders();

        // don't send userId as a parameter. The server validates the userId from the token in the header.
        let url = ROOT + '/Busidex/Post?userId=0' + '&cId=' + cardId;
        this.http.post(url, {}, { headers: headers })
            .subscribe((response: Response) => {
                this.cacheService.put(this.cacheKeys.Members, null);
                this.emit(ServiceEvents.ReferralsUpdated);
            });
    }

    removeReferral(cardId: number) {
        let headers = this.getHeaders();

        // don't send userId as a parameter. The server validates the userId from the token in the header.
        let url = ROOT + '/Busidex/Delete?id=' + cardId + '&userId=0';
        this.http.delete(url, { headers: headers })
            .subscribe((response: Response) => {
                this.cacheService.put(this.cacheKeys.Referrals, null);
                this.emit(ServiceEvents.ReferralsUpdated);
            });
    }

    updateOrganization(organization: Organization) {
        let headers = this.getHeaders();

        // don't send userId as a parameter. The server validates the userId from the token in the header.
        let url = ROOT + '/Organization/Update';
        this.http.put(url, organization, { headers: headers })
            .subscribe((response: Response) => {
                this.cacheService.put(this.cacheKeys.Organization, null);
                this.emit(ServiceEvents.OrganizationUpdated);
            });
    }

    updateCardNotes(userCardId: number, note: string) {
        let headers = this.getHeaders();

        // don't send userId as a parameter. The server validates the userId from the token in the header.
        let url = ROOT + '/Notes/Put?id=' + userCardId + '&notes=' + note;
        this.http.put(url, {}, { headers: headers })
            .subscribe((response: Response) => {

                this.cacheService.put(this.cacheKeys.Referrals, null);

                this.emit(ServiceEvents.ReferralsUpdated);
                return response;
            });
    }

    cacheOrganizationData(data) {
        this.cacheService.put(this.cacheKeys.Organization, JSON.stringify(data.Model));
    }
}
