import { Component, OnInit } from '@angular/core';
import { OktaAuthService } from '@okta/okta-angular';
import { from } from 'rxjs';
import { Store } from '@ngrx/store';
import { AppState } from '../state/app.state';
import { RemoveCurrentUser } from '../user/state/user.actions';
import { finalize } from 'rxjs/operators';
import { Router } from '@angular/router';

@Component({
  selector: 'app-logout',
  templateUrl: './logout.component.html',
  styleUrls: ['./logout.component.scss']
})
export class LogoutComponent implements OnInit {

  constructor(private authService: OktaAuthService,
              private store: Store<AppState>, private router: Router) { }

  ngOnInit() {
    from(this.authService.logout('/')).pipe(
      finalize(() => {
        this.store.dispatch(new RemoveCurrentUser());
        this.router.navigate(['login']);
      })
    ).
    subscribe();
  }

}
