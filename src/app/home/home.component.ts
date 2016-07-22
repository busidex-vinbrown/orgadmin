import { Component, OnInit } from '@angular/core';


@Component({
  selector: 'home',
  providers: [],
  directives: [],
  pipes: [],
  styles: [require('./home.component.scss')],
  templateUrl: './home.component.html'
})
export class HomeComponent implements OnInit {

  localState = { value: '' };

  constructor() {

  }



  IsOrganizationMember() {

  }

  ShowAddMembers() {

  }

  AddGroup() {

  }

  EditDetails() {

  }

  EditHomePage() {

  }

  GetGroup(id: number) {

  }

  ngOnInit() {

  }

  submitState(value) {
    console.log('submitState', value);

    this.localState.value = '';
  }
}
