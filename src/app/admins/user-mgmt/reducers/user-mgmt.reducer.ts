import { User } from '../../../auth/models/user';

import { createSelector, createFeatureSelector, createReducer, on } from '@ngrx/store';
import { UserMgmtActions } from '../actions';

export interface State {
    users: User[];
    status: Status;
}

export const selectUserMgmtState = createFeatureSelector<State>('userMgmt');

export const selectUsers = createSelector(
    selectUserMgmtState,
    state => state.users
);

export const selectUsersStatus = createSelector(
    selectUserMgmtState,
    state => state.status
);

const initialState: State = {
    users: [],
    status: ItemStatus.INIT
};

export const reducer = createReducer(
    initialState,
    on(UserMgmtActions.LoadUsers, (state: State) => {
        if (ItemStatus.LOADING === state.status || ItemStatus.STILL_LOADING === state.status) {
            return { ...state, status: ItemStatus.STILL_LOADING };
        } else if (ItemStatus.LOADED !== state.status) {
            return { ...state, status: ItemStatus.LOADING };
        } else {
            return { ...state };
        }
    }),
    on(UserMgmtActions.LoadUsersSuccess, (state, { users }) => {
        return { users, status: ItemStatus.LOADED };
    }),
    on(UserMgmtActions.LoadUsersError, (state, { errorMsg }) => {
        return { ...state, status: { errorMsg } };
    }),
)


export const reducerWithParam = (realm: string) => {
    return createReducer(
        initialState,
        on(UserMgmtActions.LoadUsers, (state: State) => {
            if (ItemStatus.LOADING === state.status || ItemStatus.STILL_LOADING === state.status) {
                return { ...state, status: ItemStatus.STILL_LOADING };
            } else if (ItemStatus.LOADED !== state.status) {
                return { ...state, status: ItemStatus.LOADING };
            } else {
                return { ...state };
            }
        }),

        on(UserMgmtActions.LoadUsersParam(realm), (state: State) => {
            console.log(`${realm} create reducer`);
            if (ItemStatus.LOADING === state.status || ItemStatus.STILL_LOADING === state.status) {
                return { ...state, status: ItemStatus.STILL_LOADING };
            } else if (ItemStatus.LOADED !== state.status) {
                return { ...state, status: ItemStatus.LOADING };
            } else {
                return { ...state };
            }
        }),
        on(UserMgmtActions.LoadUsersSuccess, (state, { users }) => {
            return { users, status: ItemStatus.LOADED };
        }),
        on(UserMgmtActions.LoadUsersSuccessParam(realm), (state, { users }) => {
            return { users, status: ItemStatus.LOADED };
        }),

        on(UserMgmtActions.LoadUsersError, (state, { errorMsg }) => {
            return { ...state, status: { errorMsg } };
        }),
    )
}

// Helper function to extract error, if there is one.
export function getError(status: Status): string | null {
    if ((status as ErrorStatus).errorMsg !== undefined) {
        return (status as ErrorStatus).errorMsg;
    }
    return null;
}

export const enum ItemStatus {
    INIT = 'INIT',
    LOADING = 'LOADING',
    STILL_LOADING = 'STILL_LOADING',
    LOADED = 'LOADED',
}
export interface ErrorStatus {
    errorMsg: string;
}

export type Status = ItemStatus | ErrorStatus;