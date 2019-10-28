import { Action } from '@ngrx/store';
import { User } from '../../user/user';

export enum UserMgmtActionTypes {
  LoadUsers = '[Users] Load Users',
  LoadUsersSuccess = '[Users] Load Users Success',
}

export class LoadUsers implements Action {
  readonly type = UserMgmtActionTypes.LoadUsers;

  constructor(public payload?: string) { }
}

export class LoadUsersSuccess implements Action {
  readonly type = UserMgmtActionTypes.LoadUsersSuccess;

  constructor(public payload: User[]) { }
}

export type UserMgmtActions = LoadUsers | LoadUsersSuccess;
