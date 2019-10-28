import { Component, OnInit } from '@angular/core';
import { UsersService } from './users.service';
import { Observable } from 'rxjs';
import { User } from '../user/user';
import { AppState } from '../state/app.state';
import { Store, select } from '@ngrx/store';
import { LoadUsers } from './state/users.actions';
import { selectUsers } from './state';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss']
})
export class UsersComponent implements OnInit {

  users$: Observable<User[]>;

  constructor(private store: Store<AppState>) { }

  ngOnInit() {
    this.store.dispatch(new LoadUsers());
    this.users$ = this.store.pipe(select(selectUsers));
  }

}
