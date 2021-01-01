import { Component, OnInit, ChangeDetectorRef  } from '@angular/core';
import { Store } from '@ngrx/store';
import * as fromRoot from '../reducers';
import * as fromAuth from '../auth/reducers/auth.reducer';
import { SessionActions } from '../auth/actions';
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

  constructor(private authService: OidcAuthService, private changeDetectorRef: ChangeDetectorRef,
     private store: Store<fromRoot.State>) {
  }

  ngOnInit() {
    this.store.select(fromAuth.selectTokens).subscribe(tokens => {
      if (tokens) {
        this.accessTokenString = tokens.accessToken;
        this.accessToken = this.parseJwt(this.accessTokenString);
        this.idTokenString = tokens.idToken;
        this.idToken = this.parseJwt(this.idTokenString);
      } else {
        this.accessTokenString = undefined;
        this.accessToken = undefined;
        this.idTokenString = undefined;
        this.idToken = undefined;
      }
    });
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
    this.authService.renew().then(user => {
      this.reloadView();
    });
    //this.store.dispatch(SessionActions.renewSession());
  }
}

interface Token {
  iat: number
  exp: number
}