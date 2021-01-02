import { Actions, createEffect, Effect, ofType, ROOT_EFFECTS_INIT } from '@ngrx/effects';
import { Injectable } from '@angular/core';
import { catchError, map, mergeMap, switchMap, withLatestFrom } from 'rxjs/operators';
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

  syncSession$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ROOT_EFFECTS_INIT),
      switchMap(() => {
        return this.authService.userSubject().pipe(
          map(authUser => {
            if (authUser) {
              const user: User = {
                id: authUser.profile.id, userName: authUser.profile.preferred_username,
                firstName: authUser.profile.family_name, lastName: authUser.profile.given_name
              };
              const tokens: Tokens = { idToken: authUser.id_token, accessToken: authUser.access_token, expired_at: authUser.expires_at }
              return SessionActions.sessionUpdated({ user, tokens });
            } else {
              return SessionActions.sessionRemoved();
            }
          })
        )
      })
    )
  );

  loadSession$ = createEffect(() =>
    this.actions$.pipe(
      ofType(SessionActions.loadSession),
      withLatestFrom(this.store.select(fromAuth.selectAuthInit)),
      map(([action, init]) => {
        if (!init) {
          const authUser = this.authService.getUser();
          if (authUser) {
            const ssws = localStorage.getItem('okta-ssws');
            const user: User = {
              id: authUser.profile.id, userName: authUser.profile.preferred_username,
              firstName: authUser.profile.family_name, lastName: authUser.profile.given_name
            };
            const tokens: Tokens = { idToken: authUser.id_token, accessToken: authUser.access_token, expired_at: authUser.expires_at }
            return SessionActions.loadSessionSuccess({ user, ssws, tokens });
          } else {
            return SessionActions.loadSessionError();
          }
        } else {
          return SessionActions.sessionLoadedBefore();
        }
      })
    )
  );

  logoutSession$ = createEffect(() =>
    this.actions$.pipe(
      ofType(SessionActions.logoutSession),
      map(() => {
        localStorage.removeItem('okta-ssws');
        this.authService.logout();
      })
    ), { dispatch: false }
  );

  // do not handle session update as it will be handled by sync session effect
  renewSession$ = createEffect(() =>
    this.actions$.pipe(
      ofType(SessionActions.renewSession),
      switchMap(() => {
        return from(this.authService.renew()).pipe(
          map(_ => {
            return SessionActions.renewSessionSuccess();
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
              id: authUser.profile.id, userName: authUser.profile.preferred_username,
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
