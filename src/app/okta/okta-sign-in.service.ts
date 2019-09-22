import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { OktaAuthService } from '@okta/okta-angular';
import { CookieService } from 'ngx-cookie-service';

@Injectable({
  providedIn: 'root'
})
export class OktaSignInService {

  readonly oktaUrl = 'https://dev-875318.okta.com/api/v1/authn';

  constructor(private http: HttpClient,
              private authService: OktaAuthService, private cookieService: CookieService) { }

  signIn({ username, password }): Observable<any> {
    return this.http.post<any>(this.oktaUrl, {
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

  signInRedirect(sessionToken: string) {
    const state = this.generateRandomId(64);
    const nonce = this.generateRandomId(64);

    const config = this.authService.getOktaConfig();

    const redirectParams = {
      responseType: config.responseType.split(' '),
      state,
      nonce,
      scopes: config.scope.split(' '),
      urls: {
        issuer: config.issuer,
        authorizeUrl: `${config.issuer}/v1/authorize`,
        userinfoUrl: `${config.issuer}/v1/userinfo`,
      }
    };
    console.log(JSON.stringify(redirectParams));

    this.cookieService.set('okta-oauth-state', state);
    this.cookieService.set('okta-oauth-nonce', nonce);
    this.cookieService.set('okta-oauth-redirect-params', JSON.stringify(redirectParams));

    const params = {
      client_id: config.clientId,
      redirect_uri: config.redirectUri,
      response_type: config.responseType,
      state,
      nonce,
      display: 'page',
      response_mode: 'fragment',
      sessionToken,
      scope: config.scope
    };
    let httpParams = new HttpParams();
    Object.keys(params).forEach((key) => {
      httpParams = httpParams.append(key, params[key]);
    });
    window.location.href = `${config.issuer}/v1/authorize?${httpParams.toString()}`;
  }

  private generateRandomId(length) {
    let result = '';
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const charactersLength = characters.length;
    for (let i = 0; i < length; i++) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
  }
}
