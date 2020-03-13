import { Component, OnInit, ChangeDetectorRef  } from '@angular/core';
import { OktaAuthService } from '@okta/okta-angular';
import { OidcSecurityService } from 'angular-auth-oidc-client';

@Component({
  selector: 'app-key-mgmt',
  templateUrl: './key-mgmt.component.html',
  styleUrls: ['./key-mgmt.component.scss']
})
export class KeyMgmtComponent implements OnInit {

  accessToken: string;
  idToken: string;

  constructor(private authService: OktaAuthService, private changeDetectorRef: ChangeDetectorRef
    , private oidcSecurityService: OidcSecurityService) {
  }

  ngOnInit() {
    this.reloadAccessTokenView();
    this.reloadIdTokenView();
  }

  reloadAccessTokenView() {
    this.accessToken = this.oidcSecurityService.getToken();
    this.changeDetectorRef.detectChanges();
  }

  reloadIdTokenView() {
    this.idToken = this.oidcSecurityService.getIdToken();
    this.changeDetectorRef.detectChanges();
  }

  parseJwt(token) {
    var base64Url = token.split('.')[1];
    var base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    var jsonPayload = decodeURIComponent(atob(base64).split('').map(function (c) {
      return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));
    return JSON.parse(jsonPayload);
  };

  renewIdToken() {
    this.oidcSecurityService.startCheckingSilentRenew();
  }

  renewAccessToken() {
    (this.authService as any).oktaAuth.tokenManager.renew('accessToken')
    .then(tokenOrTokens => {
      console.log(tokenOrTokens);
      this.reloadAccessTokenView();
    })
    .catch(err => {
      console.log(err);
    });
  }

}
