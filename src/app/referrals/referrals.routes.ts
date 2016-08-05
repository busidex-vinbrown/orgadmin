import { RouterConfig } from '@angular/router';
import { ReferralsComponent } from './referrals.component';
import { EditReferralsComponent } from './edit/edit-referrals.component';

export const referralsRoutes: RouterConfig = [
    { path: 'referrals', component: ReferralsComponent },
    { path: 'edit-referrals', component: EditReferralsComponent }
];
