import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { Observable, of } from 'rxjs';
import { OktaAuthService } from '@okta/okta-angular';
import { Store, select } from '@ngrx/store';
import { AppState } from '../state/app.state';
import { selectSSWS } from '../user/state';
import { map, tap, switchMap, mergeMap } from 'rxjs/operators';
import { iif, from } from 'rxjs';
import { SetCurrentUser, SetSSWS } from '../user/state/user.actions';

@Injectable({
  providedIn: 'root'
})
export class AdminRedirectGuard implements CanActivate {

  constructor(private authService: OktaAuthService,
              private store: Store<AppState>,
              private router: Router) {
  }

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot,
    ): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
      const ssws = localStorage.getItem('okta-ssws');
      if (ssws) {
        return this.adminRedirect();
      }
      return of(true);
  }

  adminRedirect(): Observable<boolean> {
    return of(false).pipe(
      tap(_ => {
        this.router.navigate(['admins']);
      })
    );
  }

}
