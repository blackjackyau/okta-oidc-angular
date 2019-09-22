import { Component, OnInit } from '@angular/core';
import { OktaAuthService } from '@okta/okta-angular';
import { AppState } from '../state/app.state';
import { Store, select } from '@ngrx/store';
import { SetCurrentUser } from '../user/state/user.actions';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { User } from '../user/user';
import { selectCurrentUser } from '../user/state';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  currentUser$: Observable<User>;

  constructor(private router: Router,
              private authService: OktaAuthService,
              private store: Store<AppState>) { }

  async ngOnInit() {
    const isAuthenticated = await this.authService.isAuthenticated();
    if (isAuthenticated) {
      const userClaims = await this.authService.getUser();
      this.store.dispatch(new SetCurrentUser({id: userClaims.sub, userName: userClaims.email}));
    } else {
      this.router.navigateByUrl('login');
    }

    this.currentUser$ = this.store.pipe(select(selectCurrentUser));
  }

}
