import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AdminsComponent } from './admins.component';
import { LoggedInGuard } from '../guards/logged-in.guard';
import { UserMgmtComponent } from './user-mgmt/user-mgmt.component';

const routes: Routes = [{ path: '', component: AdminsComponent, canActivate: [LoggedInGuard],
children: [
  { path: 'users', component: UserMgmtComponent },
  { path: '', redirectTo: 'users', pathMatch: 'full' },
]
}];

@NgModule({
  imports: [
    RouterModule.forChild(routes)
  ],
  exports: [RouterModule]
})
export class AdminsRoutingModule { }
