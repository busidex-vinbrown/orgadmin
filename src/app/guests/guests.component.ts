import { Component, OnInit } from '@angular/core';
import {OrganizationServiceComponent} from '../shared/organization.service';
import {Response} from '@angular/http';

@Component({
  selector: 'guests',
  providers: [],
  directives: [],
  pipes: [],
  styles: [require('./guests.component.scss')],
  templateUrl: './guests.component.html'
})
export class GuestsComponent implements OnInit {

  guests: any[];
  loading: boolean;

  constructor(private organizationService: OrganizationServiceComponent) {

  }

  ngOnInit() {

    let orgId = 12;
    this.loading = true;

    this.organizationService.getGuests(orgId)
          .map((res: Response) => res.json())
          .subscribe(
          data => {
            console.log(data);
            this.guests = data.Guests;
            this.loading = false;
          },
          err => console.error(err),
          () => console.log('done')
          );
  }
}
