/* NgRx */
import { Action } from '@ngrx/store';
import { User } from '../user';

export enum UserActionTypes {
  LoadCurrentUser = '[User] Load Current User',
  SetCurrentUser = '[User] Set Current User',
  RemoveCurrentUser = '[User] Remove Current User',
  LoadSSWS = '[User] Load SSWS',
  SetSSWS = '[User] Set SSWS Token',
  RemoveSSWS = '[User] Set SSWS Token',
}

export class LoadCurrentUser implements Action {
  readonly type = UserActionTypes.LoadCurrentUser;

  constructor() { }
}

export class SetCurrentUser implements Action {
  readonly type = UserActionTypes.SetCurrentUser;

  constructor(public payload: User) { }
}

export class RemoveCurrentUser implements Action {
  readonly type = UserActionTypes.RemoveCurrentUser;

  constructor() { }
}

export class LoadSSWS implements Action {
  readonly type = UserActionTypes.LoadSSWS;

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

export type UserActions = SetCurrentUser | RemoveCurrentUser | LoadCurrentUser | SetSSWS | RemoveSSWS;
