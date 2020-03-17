import { Component, OnInit, ChangeDetectorRef  } from '@angular/core';
import { OidcAuthService } from '../auth/auth.service';

@Component({
  selector: 'app-key-mgmt',
  templateUrl: './key-mgmt.component.html',
  styleUrls: ['./key-mgmt.component.scss']
})
export class KeyMgmtComponent implements OnInit {

  accessToken: string;
  idToken: string;

  constructor(private authService: OidcAuthService, private changeDetectorRef: ChangeDetectorRef) {
  }

  ngOnInit() {
    this.reloadAccessTokenView();
    this.reloadIdTokenView();
  }

  reloadAccessTokenView() {
    this.accessToken = this.authService.getAccessToken();
    this.changeDetectorRef.detectChanges();
  }

  reloadIdTokenView() {
    this.idToken = this.authService.getIdToken();
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
    this.authService.renew().then(() => {
      this.idToken = this.authService.getIdToken();
      this.accessToken = this.authService.getAccessToken();
      this.changeDetectorRef.detectChanges();
    });
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
