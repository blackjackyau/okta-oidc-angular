import { OnInitEffects, Actions, Effect, ofType } from '@ngrx/effects';
import { Action } from '@ngrx/store';
import { Injectable } from '@angular/core';
import { OktaAuthService } from '@okta/okta-angular';
import { from } from 'rxjs';
import { map, switchMap, tap } from 'rxjs/operators';
import { SetCurrentUser, UserActionTypes, LoadCurrentUser, SetSSWS, LoadSSWS } from './user.actions';


@Injectable()
export class CurrentUserEffects implements OnInitEffects {

  constructor(private actions$: Actions,
              private authService: OktaAuthService) { }

  @Effect()
  loadUser$ = this.actions$.pipe(
    ofType(UserActionTypes.LoadCurrentUser),
    switchMap(() => {
      return from(this.authService.getUser()).pipe(
        tap(userinfo => console.log(userinfo)),
        map(userinfo => {
          if (userinfo) {
            return new SetCurrentUser({ id: userinfo.sub, userName: userinfo.email });
          } else {
            return new SetCurrentUser(null);
          }
        })
      );
    })
  );

  ngrxOnInitEffects(): Action {
    return new LoadCurrentUser();
  }
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
