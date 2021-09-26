import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { UserMgmtService } from '../user-mgmt.service';
import { map, withLatestFrom, catchError, flatMap } from 'rxjs/operators';
import { UserMgmtActions } from '../actions';
import { Store } from '@ngrx/store';
import * as fromUserMgmt from '../reducers/user-mgmt.reducer';
import { of } from 'rxjs';

@Injectable()
export class UsersEffects {

  constructor(private actions$: Actions, private store: Store<fromUserMgmt.State>,
    private usersService: UserMgmtService) { }

  loadUsers$ = createEffect(() =>
    this.actions$.pipe(
      ofType(UserMgmtActions.LoadUsers),
      withLatestFrom(this.store.select(fromUserMgmt.selectUsersStatus)),
      flatMap(([action, status]) => { // flat map is needed to prevent http stream to be cancelled
        if (status === fromUserMgmt.ItemStatus.LOADED || status === fromUserMgmt.ItemStatus.STILL_LOADING) {
          return of(UserMgmtActions.LoadUsersNoOp());
        } else {
          return this.usersService.getUsers().pipe(
            map(users => UserMgmtActions.LoadUsersSuccess({ users })),
            catchError(err => {
              console.error(err);
              return of(UserMgmtActions.LoadUsersError({ errorMsg: err.statusText }));
            })
          );
        }
      })
    )
  );
}
