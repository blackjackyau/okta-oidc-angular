import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { User } from '../../auth/models/user';
import { Store, select } from '@ngrx/store';
import * as fromRoot from '../../reducers'
import { getError, ItemStatus, selectUserMgmtState } from './reducers/user-mgmt.reducer';
import { UserMgmtActions } from './actions';

@Component({
  selector: 'app-user-mgmt',
  templateUrl: './user-mgmt.component.html',
  styleUrls: ['./user-mgmt.component.scss']
})
export class UserMgmtComponent implements OnInit {

  users$: Observable<User[]>;
  errorMsg: string;
  loading: boolean;
  users: User[];

  constructor(private store: Store<fromRoot.State>) { }

  ngOnInit() {
    this.store.dispatch(UserMgmtActions.LoadUsers());
    this.store.pipe(select(selectUserMgmtState)).subscribe(itemState => {
      const status = itemState.status;
      switch(status) {
        case ItemStatus.LOADING:
        case ItemStatus.STILL_LOADING:
          this.loading = true;
          break;
        case ItemStatus.LOADED:
          this.loading = false;
          this.users = itemState.users;
          break;
        default:
          this.loading = false;
          this.errorMsg = getError(status);
          break;
      }
    });
  }

}
