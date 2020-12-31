import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { User } from '../../auth/models/user';
import { Store, select } from '@ngrx/store';
import * as fromRoot from '../../reducers'
import { LoadUsers } from './state/user-mgmt.actions';
import { selectUsers } from './state';

@Component({
  selector: 'app-user-mgmt',
  templateUrl: './user-mgmt.component.html',
  styleUrls: ['./user-mgmt.component.scss']
})
export class UserMgmtComponent implements OnInit {

  users$: Observable<User[]>;

  constructor(private store: Store<fromRoot.State>) { }

  ngOnInit() {
    this.store.dispatch(new LoadUsers());
    this.users$ = this.store.pipe(select(selectUsers));
  }

}
