import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { Observable, of } from 'rxjs';
import { OktaAuthService } from '@okta/okta-angular';
import { Store, select } from '@ngrx/store';
import { AppState } from '../state/app.state';
import { selectCurrentUser } from '../user/state';
import { map, mergeMap, tap } from 'rxjs/operators';
import { iif, from } from 'rxjs';
import { SetCurrentUser } from '../user/state/user.actions';

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
            mergeMap(isAuthenticated => iif(() => isAuthenticated,
            from(this.authService.getUser()).pipe(
              map(userinfo => {
                if (userinfo) {
                  this.store.dispatch(new SetCurrentUser({id: userinfo.sub, userName: userinfo.email}));
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

}
