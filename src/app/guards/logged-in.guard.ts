import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { Observable, of } from 'rxjs';
import { OktaAuthService } from '@okta/okta-angular';
import { Store, select } from '@ngrx/store';
import { AppState } from '../state/app.state';
import { selectCurrentUser } from '../user/state';
import { map, tap, switchMap, mergeMap } from 'rxjs/operators';
import { iif, from } from 'rxjs';
import { SetCurrentUser, SetSSWS } from '../user/state/user.actions';

@Injectable({
  providedIn: 'root'
})
export class LoggedInGuard implements CanActivate {

  constructor(private authService: OktaAuthService,
              private store: Store<AppState>,
              private router: Router) {
  }

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot,
    ): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {

      return this.store.pipe(select(selectCurrentUser)).pipe(
        mergeMap(
          user => iif(() => !!user,
          of(true).pipe(
            tap(_ => {
              console.log('user in store, proceed to page');
            })
          ),
          from(this.authService.isAuthenticated()).pipe(
            tap(_ => {
              console.log('user not in store, retrieving user');
            }),
            switchMap(isAuthenticated => iif(() => isAuthenticated,
            from(this.authService.getUser()).pipe(
              map(userinfo => {
                if (userinfo) {
                  console.log('userinfo');
                  this.store.dispatch(new SetCurrentUser({
                    id: userinfo.sub, userName: userinfo.email
                  }));
                  this.syncSSWS();
                }
                return !!userinfo;
              })
            ), this.loginRedirect()
            ))
          )
          )
        )
      );
  }

  loginRedirect(): Observable<boolean> {
    return of(false).pipe(
      tap(_ => {
        this.router.navigate(['login']);
      })
    );
  }

  syncSSWS() {
    const ssws = localStorage.getItem('okta-ssws');
    if (ssws) {
      this.store.dispatch(new SetSSWS(ssws));
    }
  }

}
