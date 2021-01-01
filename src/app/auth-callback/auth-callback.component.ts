import { Route } from '@angular/compiler/src/core';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { select, Store } from '@ngrx/store';
import { Subscription } from 'rxjs';
import { SessionActions } from '../auth/actions';
import { selectCurrentUser } from '../auth/reducers/auth.reducer';
import { OidcAuthService } from '../auth/services/auth.service';
import * as fromRoot from '../reducers';

@Component({
  templateUrl: './auth-callback.component.html'
})
export class AuthCallbackComponent implements OnInit, OnDestroy {

  private subscriptions: Subscription = new Subscription();

  constructor(private authService: OidcAuthService, private store: Store<fromRoot.State>, router: Router) {
    if (this.inIframe()) {
      // this.store.dispatch(SessionActions.silentCallbackEvent());
      this.authService.handleSigninSilentCallback();
    } else {
      this.subscriptions = this.store.pipe(select(selectCurrentUser)).subscribe((user) => {
        if (user) {
          router.navigate(['/']);
        }
      });
      this.store.dispatch(SessionActions.callbackEvent());
    }
  }

  ngOnDestroy(): void {
    this.subscriptions?.unsubscribe();
  }

  ngOnInit() {
  }

  private inIframe() {
    try {
      return window.self !== window.top;
    } catch (e) {
      return true;
    }
  }

}
