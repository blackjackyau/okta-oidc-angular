import { User } from '../user';
import { createSelector } from '@ngrx/store';
import { AppState } from 'src/app/state/app.state';

export interface UserState {
  currentUser: User;
}

const selectUserState = (state: AppState) => state.user;

export const selectCurrentUser = createSelector(
  selectUserState,
  state => state.currentUser
);
