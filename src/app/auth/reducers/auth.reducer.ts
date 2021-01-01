import { createFeatureSelector, createReducer, createSelector, on } from '@ngrx/store';
import { SessionActions } from '../actions'
import { Tokens } from '../models/tokens';
import { User } from '../models/user';

export const authFeatureKey = 'auth';

export interface State {
    init: boolean;
    user: User;
    ssws: String;
    tokens: Tokens;
}

export const initialState: State = {
    init: false,
    user: undefined,
    ssws: undefined,
    tokens: undefined,
};

export const reducer = createReducer(
    initialState,
    on(SessionActions.loadSessionSuccess, (state, { user, ssws, tokens }) => ({ init: true, user, ssws, tokens })),
    on(SessionActions.loadSessionError, () => initialState),
    on(SessionActions.logoutSession, () => initialState),
    on(SessionActions.renewSessionSuccess, (state, { user, tokens }) => ({ ...state, user, tokens })),
);

const selectAuthState = createFeatureSelector<State>(
    authFeatureKey
);

export const selectAuthInit = createSelector(
    selectAuthState,
    state => state.init
);

export const selectCurrentUser = createSelector(
    selectAuthState,
    state => state.user
);

export const selectSSWS = createSelector(
    selectAuthState,
    state => state.ssws
);

export const selectTokens = createSelector(
    selectAuthState,
    state => state.tokens
);
