import { OnInitEffects, Actions, Effect, ofType } from '@ngrx/effects';
import { Action } from '@ngrx/store';
import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';
import { SetCurrentUser, UserActionTypes, SetSSWS, LoadSSWS } from './user.actions';
import { OidcAuthService } from 'src/app/auth/auth.service';


@Injectable()
export class CurrentUserEffects {

  constructor(private actions$: Actions,
              private authService: OidcAuthService) { }

  @Effect()
  loadUser$ = this.actions$.pipe(
    ofType(UserActionTypes.LoadCurrentUser),
    map(() => {
      const userinfo = this.authService.getUser();
      if (userinfo) {
        return new SetCurrentUser({ id: userinfo.profile.id, userName: userinfo.profile.preferred_username });
      } else {
        return new SetCurrentUser(null);
      }
    })
  );
}

@Injectable()
export class SSWSEffects implements OnInitEffects {

  constructor(private actions$: Actions) { }

  @Effect()
  loadSSWS$ = this.actions$.pipe(
    ofType(UserActionTypes.LoadSSWS),
    map(() => {
      const ssws = localStorage.getItem('okta-ssws');
      return new SetSSWS(ssws);
    })
  );

  ngrxOnInitEffects(): Action {
    return new LoadSSWS();
  }
}
