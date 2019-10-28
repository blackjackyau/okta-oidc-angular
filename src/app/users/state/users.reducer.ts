import { UserMgmtState } from '.';
import { UserMgmtActionTypes, UserMgmtActions } from './users.actions';

const initialState: UserMgmtState = {
  users: null
};

export function reducer(state = initialState, action: UserMgmtActions): UserMgmtState {
  switch (action.type) {
    case UserMgmtActionTypes.LoadUsersSuccess:
      return {
        ...state,
        users: action.payload
      };
    default:
      return state;
  }
}

