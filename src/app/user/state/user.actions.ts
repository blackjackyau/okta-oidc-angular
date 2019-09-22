/* NgRx */
import { Action } from '@ngrx/store';
import { User } from '../user';

export enum UserActionTypes {
  SetCurrentUser = '[User] Set Current User'
}

export class SetCurrentUser implements Action {
  readonly type = UserActionTypes.SetCurrentUser;

  constructor(public payload: User) { }
}

export type UserActions = SetCurrentUser;
