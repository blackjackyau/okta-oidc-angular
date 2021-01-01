import { Actions, Effect, ofType } from '@ngrx/effects';
import { Injectable } from '@angular/core';
import { catchError, map, mergeMap, switchMap, withLatestFrom } from 'rxjs/operators';
import { OidcAuthService } from 'src/app/auth/services/auth.service';
import { SessionActions } from '../actions';
import { User } from '../models/user';
import { Tokens } from '../models/tokens';
import { from } from 'rxjs';
import { Store } from '@ngrx/store';
import * as fromRoot from '../../reducers';
import * as fromAuth from '../reducers/auth.reducer';

@Injectable()
export class SessionEffects {

  constructor(private actions$: Actions, private store: Store<fromRoot.State>, 
    private authService: OidcAuthService) { }

  @Effect()
  loadSession$ = this.actions$.pipe(
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
  );

  @Effect({ dispatch: false })
  logoutSession$ = this.actions$.pipe(
    ofType(SessionActions.logoutSession),
    map(() => {
      localStorage.removeItem('okta-ssws');
      this.authService.logout();
    })
  );

  @Effect({ dispatch: false })
  renewSession$ = this.actions$.pipe(
    ofType(SessionActions.renewSession),
    switchMap(() => {
      return this.authService.renew();
    })
  );

  @Effect()
  callbackEvent$ = this.actions$.pipe(
    ofType(SessionActions.callbackEvent),
    switchMap(() => {
      return from(this.authService.handleRedirectCallback()).pipe(
        map(authUser => {
          const ssws = localStorage.getItem('okta-ssws');
          const user: User = {
            id: authUser.profile.id, userName: authUser.profile.preferred_username,
            firstName: authUser.profile.family_name, lastName: authUser.profile.given_name
          };
          const tokens: Tokens = { idToken: authUser.id_token, accessToken: authUser.access_token, expired_at: authUser.expires_at }
          return SessionActions.loadSessionSuccess({ user, ssws, tokens });
        })
      );
    })
  );

  @Effect()
  silentCallbackEvent$ = this.actions$.pipe(
    ofType(SessionActions.silentCallbackEvent),
    switchMap(() => {
      return from(this.authService.handleSigninSilentCallback()).pipe(
        map(authUser => {
          console.log('i am here');
          console.log(authUser);
          const user: User = {
            id: authUser.profile.id, userName: authUser.profile.preferred_username,
            firstName: authUser.profile.family_name, lastName: authUser.profile.given_name
          };
          const tokens: Tokens = { idToken: authUser.id_token, accessToken: authUser.access_token, expired_at: authUser.expires_at }
          return SessionActions.renewSessionSuccess({ user, tokens });
        })
      );
    })
  );

}
