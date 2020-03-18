import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AppState } from '../state/app.state';
import { Store } from '@ngrx/store';

@Injectable({
  providedIn: 'root'
})
export class FragmentGuard implements CanActivate {

  constructor(private store: Store<AppState>,
              private router: Router) {
  }

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot,
  ): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    console.log(state.url);
    if (state.url.startsWith('/?') || state.url.startsWith('?')) {
      console.log('has fragment');
      return true;
    } else {
      console.log('to home');
      return this.router.createUrlTree(['home']);
    }
  }

}
