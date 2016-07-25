import { RouterConfig } from '@angular/router';
import { DetailsComponent } from './details.component';
import { EditDetailsComponent } from './edit/edit-details.component';

export const detailRoutes: RouterConfig = [
    { path: 'details', component: DetailsComponent },
    { path: 'details/edit', component: EditDetailsComponent }
];
