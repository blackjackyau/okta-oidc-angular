import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { AppState } from '../state/app.state';
import { Router } from '@angular/router';
import { OidcAuthService } from '../auth/auth.service';

@Component({
  selector: 'app-logout',
  templateUrl: './logout.component.html',
  styleUrls: ['./logout.component.scss']
})
export class LogoutComponent implements OnInit {

  constructor(private authService: OidcAuthService,
              private store: Store<AppState>, private router: Router) { }

  ngOnInit() {
    localStorage.removeItem('okta-ssws');
    this.authService.logout();
  }

}
