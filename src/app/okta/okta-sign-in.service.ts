import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { AuthProfilesService } from '../auth-profiles/auth-profiles.service';


@Injectable({
  providedIn: 'root'
})
export class OktaSignInService {

  constructor(private http: HttpClient,
              private authProfileService: AuthProfilesService) { }

  signIn({ username, password }): Observable<any> {
    return this.http.post<any>(`${this.authProfileService.getActiveProfile().oktaUrl}/api/v1/authn`, {
      username, password, options: {
        warnBeforePasswordExpired: true,
        multiOptionalFactorEnroll: false
      }
    }).pipe(
      tap(result => {
        console.log(result);
      })
    );
  }

  // async signInRedirectImplicit(sessionToken: string) {
  //   const params = {
  //     responseType: ['id_token', 'token'],
  //     sessionToken, // session token is required to pass during the auth service, if not it will call okta
  //   };
  //   await this.authService.loginRedirect(undefined, params);
  // }

  // async signInRedirectPKCEAuthCode(sessionToken: string) {
  //   const params = {
  //     responseType: ['code'],
  //     sessionToken, // session token is required to pass during the auth service, if not it will call okta
  //     pkce: true
  //   };
  //   await this.authService.loginRedirect(undefined, params);
  // }

  // async signInFederatedIdpRedirectPKCEAuthCode() {
  //   const params = {
  //     idp: '0oa2z3gfu5XPR3E0O357',
  //     responseType: ['code'],
  //     pkce: true
  //   };
  //   await this.authService.loginRedirect(undefined, params);
  // }
}
