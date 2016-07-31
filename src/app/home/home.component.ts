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

  ngOnInit() {

  }
}
