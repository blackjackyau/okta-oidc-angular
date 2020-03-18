import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { AppState } from '../state/app.state';
import { Store, select } from '@ngrx/store';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { User } from '../user/user';
import { selectCurrentUser } from '../user/state';
import { MediaMatcher } from '@angular/cdk/layout';
import { LoadCurrentUser } from '../user/state/user.actions';
import { OidcAuthService } from '../auth/auth.service';

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
              private store: Store<AppState>,
              private authService: OidcAuthService,
              private changeDetectorRef: ChangeDetectorRef,
              private media: MediaMatcher) { }

  ngOnInit() {
    this.mobileQuery = this.media.matchMedia('(max-width: 600px)');
    this.mobileQueryListener = () => {
      this.changeDetectorRef.detectChanges();
    };
    this.mobileQuery.addListener(this.mobileQueryListener);

    this.store.dispatch(new LoadCurrentUser());

    this.currentUser$ = this.store.pipe(select(selectCurrentUser));
  }

  logout() {
    this.router.navigate(['logout']);
  }

  OnDestroy(): void {
    this.mobileQuery.removeListener(this.mobileQueryListener);
  }

}
