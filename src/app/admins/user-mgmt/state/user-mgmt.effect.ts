import { Injectable } from '@angular/core';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { UserMgmtService } from '../user-mgmt.service';
import { UserMgmtActionTypes, LoadUsersSuccess } from './user-mgmt.actions';
import { switchMap, map } from 'rxjs/operators';

@Injectable()
export class UsersEffects {

  constructor(private actions$: Actions,
              private usersService: UserMgmtService) { }

  @Effect()
  loadUsers$ = this.actions$.pipe(
    ofType(UserMgmtActionTypes.LoadUsers),
    switchMap(() => {
      return this.usersService.getUsers().pipe(
        map(users => new LoadUsersSuccess(users))
      );
    })
  );
}
