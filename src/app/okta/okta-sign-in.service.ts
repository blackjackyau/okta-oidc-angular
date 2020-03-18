import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';


@Injectable({
  providedIn: 'root'
})
export class OktaSignInService {

  readonly oktaUrl = 'https://dev-875318.okta.com/api/v1/authn';

  constructor(private http: HttpClient) { }

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

}
