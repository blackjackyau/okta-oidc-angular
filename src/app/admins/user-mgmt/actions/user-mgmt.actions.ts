import { createAction, props } from '@ngrx/store';
import { User } from '../../../auth/models/user';

export const LoadUsers = createAction('[UserMgmt] Load Users');
export const LoadUsersSuccess = createAction('[UserMgmt/API] Load Users Success', props<{ users: User[] }>());
export const LoadUsersError = createAction('[UserMgmt/API] Load Users Error', props<{ errorMsg: string }>());
export const LoadUsersNoOp = createAction('[UserMgmt/API] Load Users No Operation');
