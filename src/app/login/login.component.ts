import { Component, OnInit } from '@angular/core';
import { OktaAuthService } from '@okta/okta-angular';
import { OktaSignInService } from '../okta/okta-sign-in.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Store } from '@ngrx/store';
import { AppState } from '../state/app.state';
import { SetCurrentUser } from '../user/state/user.actions';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  isAuthenticated: boolean;


  loginForm: FormGroup;

  isSubmitted = false;

  constructor(private authService: OktaAuthService,
              private signInService: OktaSignInService,
              private formBuilder: FormBuilder,
              private store: Store<AppState>) {
    this.authService.$authenticationState.subscribe(isAuthenticated => this.isAuthenticated = isAuthenticated);
  }

  async ngOnInit() {
    this.loginForm = this.formBuilder.group({
      username: ['', Validators.required],
      password: ['', Validators.required]
    });
    this.isAuthenticated = await this.authService.isAuthenticated();
    // TODO: move logic to login guard
    console.log(`isAuthenticated ${this.isAuthenticated}`);
    if (this.isAuthenticated) {
      this.authService.loginRedirect();
    }
  }

  logout() {
    this.authService.logout('/');
  }

  login() {
    if (this.loginForm.invalid) {
      return;
    }
    this.signInService.signIn(this.loginForm.value)
      .subscribe(result => {
        this.signInService.signInRedirect(result.sessionToken);
      });
  }

}
