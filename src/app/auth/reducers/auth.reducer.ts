import { createFeatureSelector, createReducer, createSelector, on } from '@ngrx/store';
import { SessionActions } from '../actions'
import { User } from '../models/user';

export const authFeatureKey = 'auth';

export interface State {
    currentUser: User;
    sswsToken: String;
}

export const initialState: State = {
    currentUser: null,
    sswsToken: null
};

export const reducer = createReducer(
    initialState,
    on(SessionActions.setSession, (state, { user, ssws }) => ({ currentUser: user, sswsToken: ssws })),
    on(SessionActions.removeSession, () => initialState)
);

const selectAuthState = createFeatureSelector<State>(
    authFeatureKey
);

export const selectCurrentUser = createSelector(
    selectAuthState,
    state => state.currentUser
);

export const selectSSWS = createSelector(
    selectAuthState,
    state => state.sswsToken
);
