import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import * as fromRoot from '../reducers'
import { Store, select } from '@ngrx/store';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { User } from '../auth/models/user';
import { selectCurrentUser } from '../auth/reducers/auth.reducer';
import { MediaMatcher } from '@angular/cdk/layout';
import { SessionActions } from '../auth/actions'

@Component({
  selector: 'app-admins',
  templateUrl: './admins.component.html',
  styleUrls: ['./admins.component.scss']
})
export class AdminsComponent implements OnInit {

  currentUser$: Observable<User>;

  sideMenus = [
    {
      label: 'Manage Users',
      link: 'users',
      icon: 'person'
    },
    {
      label: 'Manage Users 2',
      link: 'users2',
      icon: 'person'
    },
    {
      label: 'Key Management',
      link: 'key-mgmt',
      icon: 'vpn_key'
    }
  ];

  mobileQuery: MediaQueryList;

  private mobileQueryListener: () => void;

  constructor(private router: Router,
    private store: Store<fromRoot.State>,
    private changeDetectorRef: ChangeDetectorRef,
    private media: MediaMatcher) { }

  ngOnInit() {
    this.mobileQuery = this.media.matchMedia('(max-width: 600px)');
    this.mobileQueryListener = () => {
      this.changeDetectorRef.detectChanges();
    };
    this.mobileQuery.addListener(this.mobileQueryListener);

    this.store.dispatch(SessionActions.loadSession());
    this.currentUser$ = this.store.pipe(select(selectCurrentUser));
  }

  logout() {
    this.store.dispatch(SessionActions.logoutSession());
  }

  renew() {
  }

  OnDestroy(): void {
    this.mobileQuery.removeListener(this.mobileQueryListener);
  }

}
