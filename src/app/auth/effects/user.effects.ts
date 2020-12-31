import { Actions, Effect, ofType } from '@ngrx/effects';
import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';
import { OidcAuthService } from 'src/app/auth/services/auth.service';
import { SessionActions } from '../actions';


@Injectable()
export class SessionEffects {

  constructor(private actions$: Actions,
              private authService: OidcAuthService) { }

  @Effect()
  loadSession$ = this.actions$.pipe(
    ofType(SessionActions.loadSession),
    map(() => {
      const userinfo = this.authService.getUser();
      if (userinfo) {
        const ssws = localStorage.getItem('okta-ssws');
        const user = { id: userinfo.profile.id, userName: userinfo.profile.preferred_username };
        return SessionActions.setSession({ user, ssws });
      } else {
        return SessionActions.setSession({ user: undefined, ssws: undefined });
      }
    })
  );

}
