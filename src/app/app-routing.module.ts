import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {
  OktaCallbackComponent,
} from '@okta/okta-angular';
import { LoginComponent } from './login/login.component';
import { HomeComponent } from './home/home.component';
import { LoggedInGuard } from './guards/logged-in.guard';
import { LoginGuard } from './guards/login.guard';
import { LogoutComponent } from './logout/logout.component';
import { FragmentGuard } from './guards/fragment.guard';
import { AdminRedirectGuard } from './guards/admin-redirect.guard';

const routes: Routes = [
  // runGuardsAndResolvers need to be 'always' as during the redirection from # callback url to / does not contain any query params changes
  // due to limitation to SPA as statis assets, there's no handling of 404 missing assets
  // to workaround with it, the callback url has to be from the root
  { path: '', component: OktaCallbackComponent, canActivate: [FragmentGuard], runGuardsAndResolvers: 'always'},
  { path: 'login', component: LoginComponent, canActivate: [LoginGuard] },
  { path: 'logout', component: LogoutComponent },
  { path: 'home', component: HomeComponent, canActivate: [LoggedInGuard, AdminRedirectGuard] },
  { path: 'admins', loadChildren: () => import('./admins/admins.module').then(m => m.AdminsModule) },
  { path: '**', redirectTo: 'home' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
