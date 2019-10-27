/* NgRx */
import { Action } from '@ngrx/store';
import { User } from '../user';

export enum UserActionTypes {
  SetCurrentUser = '[User] Set Current User',
  RemoveCurrentUser = '[User] Remove Current User',
  SetSSWS = '[User] Set SSWS Token',
  RemoveSSWS = '[User] Set SSWS Token',
}

export class SetCurrentUser implements Action {
  readonly type = UserActionTypes.SetCurrentUser;

  constructor(public payload: User) { }
}

export class RemoveCurrentUser implements Action {
  readonly type = UserActionTypes.RemoveCurrentUser;

  constructor() { }
}

export class SetSSWS implements Action {
  readonly type = UserActionTypes.SetSSWS;

  constructor(public payload: string) { }
}

export class RemoveSSWS implements Action {
  readonly type = UserActionTypes.RemoveSSWS;

  constructor(public payload: string) { }
}

export type UserActions = SetCurrentUser | RemoveCurrentUser | SetSSWS | RemoveSSWS;
