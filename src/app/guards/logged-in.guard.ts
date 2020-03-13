import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { Observable, of, from } from 'rxjs';
import { OktaAuthService } from '@okta/okta-angular';
import { Store, select } from '@ngrx/store';
import { AppState } from '../state/app.state';
import { selectCurrentUser } from '../user/state';
import { tap, switchMap } from 'rxjs/operators';
import { OidcSecurityService } from 'angular-auth-oidc-client';

@Injectable({
  providedIn: 'root'
})
export class LoggedInGuard implements CanActivate {

  constructor(private router: Router, private authService: OktaAuthService, private oidcSecurityService: OidcSecurityService) {
  }

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot,
    ): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {

      return this.oidcSecurityService.getIsAuthorized().pipe(
        switchMap(authenticated => {
          if (authenticated) {
            console.log('LoggedInGuard authenticated');
            return of(true);
          }
          return this.loginRedirect();
        })
      );
  }

  loginRedirect(): Observable<boolean> {
    return of(false).pipe(
      tap(_ => {
        console.log('LoggedInGuard not authenticated, to go login');
        this.router.navigate(['login']);
      })
    );
  }

}
