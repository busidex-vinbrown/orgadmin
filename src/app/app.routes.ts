import { provideRouter, RouterConfig } from '@angular/router';

import { DetailsComponent } from './details/details.component';
import { StartComponent } from './start/start.component';
import { AboutComponent } from './about';
import { memberRoutes } from './members/members.routes';
import { detailRoutes } from './details/details.routes';
import { guestsRoutes } from './guests/guests.routes';
import { referralsRoutes } from './referrals/referrals.routes';
import { loginRoutes } from './login/login.routes';
import { logoutRoutes } from './logout/logout.routes';
import { editMessageRoutes } from './edit-message/edit-message.routes';
import { startRoutes } from './start/start.routes';

export const routes: RouterConfig = [

  //{ path: '', redirectTo: '/details', terminal: true },
  ...memberRoutes,
  ...detailRoutes,
  ...guestsRoutes,
  ...referralsRoutes,
  ...loginRoutes,
  ...logoutRoutes,
  ...editMessageRoutes,
  ...startRoutes
];

export const APP_ROUTER_PROVIDERS = [
  provideRouter(routes)
];
