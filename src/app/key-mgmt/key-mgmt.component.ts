import { Component, OnInit, ChangeDetectorRef  } from '@angular/core';
import { OidcAuthService } from '../auth/services/auth.service';

@Component({
  selector: 'app-key-mgmt',
  templateUrl: './key-mgmt.component.html',
  styleUrls: ['./key-mgmt.component.scss']
})
export class KeyMgmtComponent implements OnInit {

  accessTokenString: string;
  idTokenString: string;

  accessToken: Token;
  idToken: Token;

  currentTime = Math.trunc(Date.now() / 1000);

  constructor(private authService: OidcAuthService, private changeDetectorRef: ChangeDetectorRef) {
  }

  ngOnInit() {
    this.reloadView();
  }

  reloadView() {
    this.accessTokenString = this.authService.getAccessToken();
    this.accessToken = this.parseJwt(this.accessTokenString);
    this.idTokenString = this.authService.getIdToken();
    this.idToken = this.parseJwt(this.idTokenString);
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

  renew() {
    this.authService.renew().then(() => {
      this.reloadView();
    });
  }
}

interface Token {
  iat: number
  exp: number
}