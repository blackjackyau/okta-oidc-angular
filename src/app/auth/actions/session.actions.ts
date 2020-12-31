/* NgRx */
import { createAction, props } from '@ngrx/store';
import { User } from '../models/user';

export const loadSession = createAction('[Auth] Load Session');
export const setSession = createAction('[Auth] Set Session', props<{ user: User, ssws: String }>());
export const removeSession = createAction('[Auth] Remove Session');
