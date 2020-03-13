import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { AppState } from '../state/app.state';
import { RemoveCurrentUser } from '../user/state/user.actions';
import { Router } from '@angular/router';
import { OidcSecurityService } from 'angular-auth-oidc-client';

@Component({
  selector: 'app-logout',
  templateUrl: './logout.component.html',
  styleUrls: ['./logout.component.scss']
})
export class LogoutComponent implements OnInit {

  constructor(private oidcSecurityService: OidcSecurityService,
              private store: Store<AppState>) { }

  ngOnInit() {
    this.store.dispatch(new RemoveCurrentUser());
    localStorage.removeItem('okta-ssws');
    this.oidcSecurityService.logoff();
  }

}
