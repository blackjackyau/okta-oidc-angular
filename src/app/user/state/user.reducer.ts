import { UserState } from '.';
import { UserActions, UserActionTypes } from './user.actions';

const initialState: UserState = {
  currentUser: null
};

export function reducer(state = initialState, action: UserActions): UserState {
  console.log(action);
  console.log(state);
  switch (action.type) {
    case UserActionTypes.SetCurrentUser:
      return {
        ...state,
        currentUser: action.payload
      };

    default:
      return state;
  }
}
