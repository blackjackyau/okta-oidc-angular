import { User } from '../../user/user';

import { AppState } from '../../state/app.state';

import { createSelector } from '@ngrx/store';

export interface UserMgmtState {
  users: User[];
}

const selectUserMgmtState = (state: AppState) => state.userMgmt;

export const selectUsers = createSelector(
  selectUserMgmtState,
  state => state.users
);
