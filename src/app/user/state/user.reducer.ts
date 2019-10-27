import { UserState } from '.';
import { UserActions, UserActionTypes } from './user.actions';

const initialState: UserState = {
  currentUser: null,
  sswsToken: null
};

export function reducer(state = initialState, action: UserActions): UserState {
  switch (action.type) {
    case UserActionTypes.SetCurrentUser:
      return {
        ...state,
        currentUser: action.payload
      };
    case UserActionTypes.RemoveCurrentUser:
      return {
        ...state,
        currentUser: null
      };
    case UserActionTypes.SetSSWS:
      return {
        ...state,
        sswsToken: action.payload
      };
    case UserActionTypes.RemoveSSWS:
      return {
        ...state,
        sswsToken: null
      };
    default:
      return state;
  }
}

