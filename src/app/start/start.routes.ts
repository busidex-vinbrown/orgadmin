import { RouterConfig } from '@angular/router';
import { StartComponent } from './start.component';

export const startRoutes: RouterConfig = [
  { path: 'start/:id', component: StartComponent }
];

