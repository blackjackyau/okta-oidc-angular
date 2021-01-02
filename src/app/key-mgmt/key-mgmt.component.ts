import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import * as fromRoot from '../reducers';
import * as fromAuth from '../auth/reducers/auth.reducer';
import { SessionActions } from '../auth/actions';

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

  constructor(private store: Store<fromRoot.State>) {
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

  parseJwt(token) {
    var base64Url = token.split('.')[1];
    var base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    var jsonPayload = decodeURIComponent(atob(base64).split('').map(function (c) {
      return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));
    return JSON.parse(jsonPayload);
  };

  renew() {
    this.store.dispatch(SessionActions.renewSession());
  }
}

interface Token {
  iat: number
  exp: number
}