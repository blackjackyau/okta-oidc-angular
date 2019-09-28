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

const routes: Routes = [
  { path: 'login', component: LoginComponent, canActivate: [LoginGuard] },
  { path: 'logout', component: LogoutComponent },
  { path: 'implicit/callback', component: OktaCallbackComponent },
  { path: '', component: HomeComponent, canActivate: [LoggedInGuard] },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
