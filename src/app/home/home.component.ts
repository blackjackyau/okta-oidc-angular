import { Component, OnInit } from '@angular/core';
import { OktaAuthService } from '@okta/okta-angular';
import { AppState } from '../state/app.state';
import { Store, select } from '@ngrx/store';
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
              private store: Store<AppState>,
              private oktaAuthService: OktaAuthService) { }

  ngOnInit() {
    this.currentUser$ = this.store.pipe(select(selectCurrentUser));
  }

  logout() {
    this.router.navigate(['logout']);
  }

  renew() {
    (this.oktaAuthService as any).oktaAuth.token.getWithoutPrompt({
      responseType: 'id_token', // or array of types
    })
    .then(tokenOrTokens => {
      console.log(tokenOrTokens);
    })
    .catch(err => {
      console.log(err);
    });
  }

}
