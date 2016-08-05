import { RouterConfig } from '@angular/router';
import { MembersComponent } from './members.component';
import { EditMembersComponent } from './edit/edit-members.component';

export const memberRoutes: RouterConfig = [
    { path: 'members', component: MembersComponent },
    { path: 'edit-members', component: EditMembersComponent }
];
