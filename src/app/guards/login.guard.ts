import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { Observable, from, iif, of } from 'rxjs';
import { OktaAuthService } from '@okta/okta-angular';
import { AppState } from '../state/app.state';
import { Store } from '@ngrx/store';
import { mergeMap, map, tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class LoginGuard implements CanActivate {

  constructor(private authService: OktaAuthService,
              private store: Store<AppState>,
              private router: Router) {
  }

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot,
  ): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {

    return from(this.authService.isAuthenticated()).pipe(
      mergeMap(isAuthenticated => iif(() => isAuthenticated,
        this.homeRedirect(),
        of(true)
      ))
    );
  }

  homeRedirect(): Observable<boolean> {
    return of(false).pipe(
      tap(_ => {
        this.authService.loginRedirect();
      })
    );
  }

}
