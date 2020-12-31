import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { Observable, of } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AdminRedirectGuard implements CanActivate {

  constructor(private router: Router) {
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
