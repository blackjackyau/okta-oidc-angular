import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { HomeComponent } from './home/home.component';
import { LoggedInGuard } from './guards/logged-in.guard';
import { LoginGuard } from './guards/login.guard';
import { FragmentGuard } from './guards/fragment.guard';
import { AdminRedirectGuard } from './guards/admin-redirect.guard';
import { KeyMgmtComponent } from './key-mgmt/key-mgmt.component';
import { AuthCallbackComponent } from './auth-callback/auth-callback.component';
import { AuthProfilesComponent } from './auth-profiles/auth-profiles.component';

const routes: Routes = [
  // runGuardsAndResolvers need to be 'always' as during the redirection from # callback url to / does not contain any query params changes
  // due to limitation to SPA as statis assets, there's no handling of 404 missing assets
  // to workaround with it, the callback url has to be from the root
  { path: '', component: AuthCallbackComponent, canActivate: [FragmentGuard], runGuardsAndResolvers: 'always' },
  { path: 'profiles', component: AuthProfilesComponent },
  { path: 'login', component: LoginComponent, canActivate: [LoginGuard] },
  {
    path: 'home', component: HomeComponent, canActivate: [LoggedInGuard, AdminRedirectGuard],
    children: [
      { path: 'key-mgmt', component: KeyMgmtComponent },
      { path: '', redirectTo: 'key-mgmt', pathMatch: 'full' },
    ]
  },
  { path: 'admins', loadChildren: () => import('./admins/admins.module').then(m => m.AdminsModule) },
  { path: '**', redirectTo: 'home' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { relativeLinkResolution: 'legacy' })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
