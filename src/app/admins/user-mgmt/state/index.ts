import { User } from '../../../user/user';

import { createSelector, createFeatureSelector } from '@ngrx/store';

export interface UserMgmtState {
  users: User[];
}

export const selectUserMgmtState = createFeatureSelector<UserMgmtState>('userMgmt');

export const selectUsers = createSelector(
  selectUserMgmtState,
  state => state.users
);
