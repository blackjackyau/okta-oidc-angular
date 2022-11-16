import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Injectable } from '@angular/core';
import { catchError, map, switchMap, withLatestFrom } from 'rxjs/operators';
import { OidcAuthService } from 'src/app/auth/services/auth.service';
import { SessionActions } from '../actions';
import { User } from '../models/user';
import { Tokens } from '../models/tokens';
import { from, of } from 'rxjs';
import { Store } from '@ngrx/store';
import * as fromRoot from '../../reducers';
import * as fromAuth from '../reducers/auth.reducer';

@Injectable()
export class SessionEffects {

  constructor(private actions$: Actions, private store: Store<fromRoot.State>,
    private authService: OidcAuthService) { }

  loadSession$ = createEffect(() =>
    this.actions$.pipe(
      ofType(SessionActions.loadSession),
      withLatestFrom(this.store.select(fromAuth.selectAuthInit)),
      switchMap(([action, init]) => {
        if (!init) {
          return this.authService.user$().pipe(
            //take(1),
            map(authUser => {
              if (authUser) {
                const ssws = localStorage.getItem('okta-ssws');
                const user: User = {
                  id: authUser.profile.sub, userName: authUser.profile.preferred_username,
                  firstName: authUser.profile.family_name, lastName: authUser.profile.given_name
                };
                const tokens: Tokens = { idToken: authUser.id_token, accessToken: authUser.access_token, expired_at: authUser.expires_at };
                return SessionActions.loadSessionSuccess({ user, ssws, tokens });
              } else {
                return SessionActions.loadSessionError();
              }
            })
          )
        } else {
          return of(SessionActions.sessionLoadedBefore());
        }
      })
    )
  );

  logoutSession$ = createEffect(() =>
    this.actions$.pipe(
      ofType(SessionActions.logoutSession),
      switchMap(() => {
        return this.authService.logout();
      }),
      map(() => {
        // alert(window.location.href); for debugging
        localStorage.removeItem('okta-ssws');
        return SessionActions.logoutSessionSuccess();
      })
    )
  );

  // do not handle session update as it will be handled by sync session effect
  renewSession$ = createEffect(() =>
    this.actions$.pipe(
      ofType(SessionActions.renewSession),
      switchMap(() => {
        return from(this.authService.renew()).pipe(
          map(authUser => {
            const user: User = {
              id: authUser.profile.sub, userName: authUser.profile.preferred_username,
              firstName: authUser.profile.family_name, lastName: authUser.profile.given_name
            };
            const tokens: Tokens = { idToken: authUser.id_token, accessToken: authUser.access_token, expired_at: authUser.expires_at };
            return SessionActions.renewSessionSuccess({ user, tokens });
          }),
          catchError(err => {
            console.error(err);
            return of(SessionActions.renewSessionError());
          })
        );
      })
    )
  );

  onSignInCallback$ = createEffect(() =>
    this.actions$.pipe(
      ofType(SessionActions.handleSignInCallback),
      switchMap(() => {
        return from(this.authService.handleRedirectCallback()).pipe(
          map(authUser => {
            const ssws = localStorage.getItem('okta-ssws');
            const user: User = {
              id: authUser.profile.sub, userName: authUser.profile.preferred_username,
              firstName: authUser.profile.family_name, lastName: authUser.profile.given_name
            };
            const tokens: Tokens = { idToken: authUser.id_token, accessToken: authUser.access_token, expired_at: authUser.expires_at };
            return SessionActions.loadSessionSuccess({ user, ssws, tokens });
          }),
          catchError(err => {
            console.error(err);
            return of(SessionActions.loadSessionError());
          })
        );
      })
    )
  );

  // execute in iframe, not visible as ngrx action
  onSilentCallback$ = createEffect(() =>
    this.actions$.pipe(
      ofType(SessionActions.handleSilentSignInCallback),
      switchMap(() => {
        return from(this.authService.handleSigninSilentCallback());
      })
    ), { dispatch: false }
  );
}
