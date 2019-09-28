/* NgRx */
import { Action } from '@ngrx/store';
import { User } from '../user';

export enum UserActionTypes {
  SetCurrentUser = '[User] Set Current User',
  RemoveCurrentUser = '[User] Remove Current User',
}

export class SetCurrentUser implements Action {
  readonly type = UserActionTypes.SetCurrentUser;

  constructor(public payload: User) { }
}

export class RemoveCurrentUser implements Action {
  readonly type = UserActionTypes.RemoveCurrentUser;

  constructor() { }
}

export type UserActions = SetCurrentUser | RemoveCurrentUser;
