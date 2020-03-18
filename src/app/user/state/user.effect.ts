import { OnInitEffects, Actions, Effect, ofType } from '@ngrx/effects';
import { Action } from '@ngrx/store';
import { Injectable } from '@angular/core';
import { OktaAuthService } from '@okta/okta-angular';
import { from, Observable } from 'rxjs';
import { map, switchMap, tap } from 'rxjs/operators';
import { SetCurrentUser, UserActionTypes, LoadCurrentUser, SetSSWS, LoadSSWS } from './user.actions';
import { OidcAuthService } from 'src/app/auth/auth.service';


@Injectable()
export class CurrentUserEffects {

  constructor(private actions$: Actions,
              private authService: OidcAuthService) { }

  @Effect()
  loadUser$ = this.actions$.pipe(
    ofType(UserActionTypes.LoadCurrentUser),
    map(() => {
      const userinfo = this.authService.getCurrentUser();
      if (userinfo) {
        return new SetCurrentUser({ id: userinfo.id, userName: userinfo.email });
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
