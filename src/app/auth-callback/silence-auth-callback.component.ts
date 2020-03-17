import { Component, OnInit } from '@angular/core';
import { OidcAuthService } from '../auth/auth.service';

@Component({
  templateUrl: './auth-callback.component.html'
})
export class SilenceAuthCallbackComponent implements OnInit {

  constructor(authService: OidcAuthService) {
    authService.handleSigninSilentCallback();
  }

  ngOnInit() {
  }

}
