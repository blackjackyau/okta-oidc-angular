/* NgRx */
import { createAction, props } from '@ngrx/store';
import { Tokens } from '../models/tokens';
import { User } from '../models/user';

export const loadSession = createAction('[Auth] Load Session');
export const loadSessionSuccess = createAction('[Auth/API] Load Session Success', props<{ user: User, ssws: String, tokens: Tokens }>());
export const sessionLoadedBefore = createAction('[Auth/API] Session Loaded Before');
export const loadSessionError = createAction('[Auth/API] Load Session Error');

export const logoutSession = createAction('[Auth] Logout Session');
export const logoutSessionSuccess = createAction('[Auth/API] Logout Session Success');

export const renewSession = createAction('[Auth] Renew Session');
export const renewSessionSuccess = createAction('[Auth/API] Renew Session Success', props<{ user: User, tokens: Tokens }>());
export const renewSessionError = createAction('[Auth/API] Renew Session Error');

export const handleSignInCallback = createAction('[Auth] Handle SignIn Callback');
export const handleSilentSignInCallback = createAction('[Auth] Handle Silent Sign In Callback');
