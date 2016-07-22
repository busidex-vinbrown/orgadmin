import { provideRouter, RouterConfig } from '@angular/router';

import { DetailsComponent } from './details/details.component';
import { AboutComponent } from './about';
import { memberRoutes } from './members/members.routes';
import { detailRoutes } from './details/details.routes';
import { guestsRoutes } from './guests/guests.routes';
import { referralsRoutes } from './referrals/referrals.routes';
import { loginRoutes } from './login/login.routes';
import { logoutRoutes } from './logout/logout.routes';

export const routes: RouterConfig = [

  { path: '', redirectTo: '/details', terminal: true },
  { path: 'home', component: DetailsComponent },
  { path: 'about', component: AboutComponent },
  ...memberRoutes,
  ...detailRoutes,
  ...guestsRoutes,
  ...referralsRoutes,
  ...loginRoutes,
  ...logoutRoutes
];

export const APP_ROUTER_PROVIDERS = [
  provideRouter(routes)
];
