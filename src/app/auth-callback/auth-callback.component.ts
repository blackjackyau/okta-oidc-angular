import { Component, OnInit } from '@angular/core';
import { OidcAuthService } from '../auth/auth.service';

@Component({
  templateUrl: './auth-callback.component.html'
})
export class AuthCallbackComponent implements OnInit {

  constructor(authService: OidcAuthService) {
    authService.handleRedirectCallback();
  }

  ngOnInit() {
  }

}
