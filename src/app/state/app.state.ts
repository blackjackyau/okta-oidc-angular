import { UserState } from '../user/state';
import { UserMgmtState } from '../users/state';

// Representation of the entire app state
// Extended by lazy loaded modules
export interface AppState {
  user: UserState;
  userMgmt: UserMgmtState;
}
