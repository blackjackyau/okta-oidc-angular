import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { AppState } from '../state/app.state';
import { Store, select } from '@ngrx/store';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { User } from '../user/user';
import { selectCurrentUser } from '../user/state';
import { MediaMatcher } from '@angular/cdk/layout';
import { LoadCurrentUser, LoadSSWS } from '../user/state/user.actions';

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
      label: 'Key Management',
      link: 'key-mgmt',
      icon: 'vpn_key'
    }
  ];

  mobileQuery: MediaQueryList;

  private mobileQueryListener: () => void;

  constructor(private router: Router,
              private store: Store<AppState>,
              private changeDetectorRef: ChangeDetectorRef,
              private media: MediaMatcher) { }

  ngOnInit() {
    this.mobileQuery = this.media.matchMedia('(max-width: 600px)');
    this.mobileQueryListener = () => {
      this.changeDetectorRef.detectChanges();
    };
    this.mobileQuery.addListener(this.mobileQueryListener);

    this.store.dispatch(new LoadCurrentUser());
    this.store.dispatch(new LoadSSWS());
    this.currentUser$ = this.store.pipe(select(selectCurrentUser));
  }

  logout() {
    this.router.navigate(['logout']);
  }

  renew() {
  }

  OnDestroy(): void {
    this.mobileQuery.removeListener(this.mobileQueryListener);
  }

}
