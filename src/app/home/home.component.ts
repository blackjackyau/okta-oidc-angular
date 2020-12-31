import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import * as fromRoot from '../reducers';
import { Store, select } from '@ngrx/store';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { User } from '../auth/models/user';
import { selectCurrentUser } from '../auth/reducers/auth.reducer';
import { MediaMatcher } from '@angular/cdk/layout';
import { SessionActions } from '../auth/actions';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  currentUser$: Observable<User>;

  sideMenus = [
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
    this.router.navigate(['logout']);
  }

  OnDestroy(): void {
    this.mobileQuery.removeListener(this.mobileQueryListener);
  }

}
