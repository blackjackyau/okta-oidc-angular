import { Component, OnInit } from '@angular/core';
import { OidcAuthService } from '../auth/auth.service';

@Component({
  templateUrl: './auth-callback.component.html'
})
export class AuthCallbackComponent implements OnInit {

  constructor(authService: OidcAuthService) {
    if (this.inIframe()) {
      authService.handleSigninSilentCallback();
    } else {
      authService.handleRedirectCallback();
    }
  }

  ngOnInit() {
  }

  private inIframe() {
    try {
      return window.self !== window.top;
    } catch (e) {
      return true;
    }
  }

}
