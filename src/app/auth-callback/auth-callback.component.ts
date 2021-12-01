import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { select, Store } from '@ngrx/store';
import { Subscription } from 'rxjs';
import { SessionActions } from '../auth/actions';
import { selectAuthInit } from '../auth/reducers/auth.reducer';
import * as fromRoot from '../reducers';

@Component({
  templateUrl: './auth-callback.component.html'
})
export class AuthCallbackComponent implements OnInit, OnDestroy {

  private subscriptions: Subscription = new Subscription();

  constructor(private store: Store<fromRoot.State>, router: Router) {
    if (this.inIframe()) {
      this.store.dispatch(SessionActions.handleSilentSignInCallback());
    } else {
      this.subscriptions = this.store.pipe(select(selectAuthInit)).subscribe((init) => {
        if (init) {
          router.navigate(['/']);
        }
      });
      this.store.dispatch(SessionActions.handleSignInCallback());
    }
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
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
