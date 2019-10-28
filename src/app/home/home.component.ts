import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { OktaAuthService } from '@okta/okta-angular';
import { AppState } from '../state/app.state';
import { Store, select } from '@ngrx/store';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { User } from '../user/user';
import { selectCurrentUser, selectSSWS } from '../user/state';
import { MediaMatcher } from '@angular/cdk/layout';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  currentUser$: Observable<User>;
  ssws$: Observable<string>;

  sideMenus = [
    {
      label: 'Manage Users',
      link: 'users',
      icon: 'person'
    }
  ];

  mobileQuery: MediaQueryList;

  private mobileQueryListener: () => void;

  constructor(private router: Router,
              private store: Store<AppState>,
              private oktaAuthService: OktaAuthService,
              private changeDetectorRef: ChangeDetectorRef,
              private media: MediaMatcher) { }

  ngOnInit() {
    this.mobileQuery = this.media.matchMedia('(max-width: 600px)');
    this.mobileQueryListener = () => {
      this.changeDetectorRef.detectChanges();
    };
    this.mobileQuery.addListener(this.mobileQueryListener);
    this.currentUser$ = this.store.pipe(select(selectCurrentUser));
    this.ssws$ = this.store.pipe(select(selectSSWS));
  }

  logout() {
    this.router.navigate(['logout']);
  }

  renew() {
    (this.oktaAuthService as any).oktaAuth.token.getWithoutPrompt({
      responseType: ['id_token', 'token'], // or array of types
    })
    .then(tokenOrTokens => {
      console.log(tokenOrTokens);
    })
    .catch(err => {
      console.log(err);
    });
  }

  OnDestroy(): void {
    this.mobileQuery.removeListener(this.mobileQueryListener);
  }

}
