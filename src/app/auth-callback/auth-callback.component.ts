import { Component, OnInit } from '@angular/core';
import { OidcSecurityService } from 'angular-auth-oidc-client';
import { Router } from '@angular/router';

@Component({
  selector: 'app-auth-callback',
  templateUrl: './auth-callback.component.html',
  styleUrls: ['./auth-callback.component.scss']
})
export class AuthCallbackComponent implements OnInit {

  ngOnInit(): void {
  }

  constructor(public oidcSecurityService: OidcSecurityService, private router: Router) {
    if (this.oidcSecurityService.moduleSetup) {
      this.doCallbackLogicIfRequired();
    } else {
      this.oidcSecurityService.onModuleSetup.subscribe(() => {
        this.doCallbackLogicIfRequired();
      });
    }
  }

  private doCallbackLogicIfRequired() {
    this.oidcSecurityService.onAuthorizationResult.subscribe(() => {
      console.log('authorizedCallbackWithCode done, to go home page');
      this.router.navigateByUrl('home');
    });
    console.log('doCallbackLogicIfRequired');
    // Will do a callback, if the url has a code and state parameter.
    this.oidcSecurityService.authorizedCallbackWithCode(window.location.toString());
  }
}
