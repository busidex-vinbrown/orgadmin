import { Component } from '@angular/core';

@Component({
  selector: 'search', 
  // We need to tell Angular's Dependency Injection which providers are in our app.
  providers: [
    
  ],
    directives: [
    
  ],
  pipes: [ ],
  styles: [  
    require('./search.component.scss')
   ],
  // Every Angular template is first compiled by the browser before Angular runs it's compiler
  templateUrl: './search.component.html'
})
export class SearchComponent {

}