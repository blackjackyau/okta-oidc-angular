import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { User } from '../../auth/models/user';
import { Store, select } from '@ngrx/store';
import * as fromRoot from '../../reducers'
import { getError, selectUsers, selectUsersStatus } from './reducers/user-mgmt.reducer';
import { UserMgmtActions } from './actions';

@Component({
  selector: 'app-user-mgmt',
  templateUrl: './user-mgmt.component.html',
  styleUrls: ['./user-mgmt.component.scss']
})
export class UserMgmtComponent implements OnInit {

  users$: Observable<User[]>;
  errorMsg: string;

  constructor(private store: Store<fromRoot.State>) { }

  ngOnInit() {
    this.store.dispatch(UserMgmtActions.LoadUsers());
    this.users$ = this.store.pipe(select(selectUsers));
    this.store.pipe(select(selectUsersStatus)).subscribe(status => {
      this.errorMsg = getError(status);
    });
  }

}
