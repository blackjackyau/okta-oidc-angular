import { Component, OnInit } from '@angular/core';
import { OktaSignInService } from '../okta/okta-sign-in.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { environment } from '../../environments/environment';
import { Store } from '@ngrx/store';
import { AppState } from '../state/app.state';
import { OidcAuthService } from '../auth/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  loginForm: FormGroup;

  isSubmitted = false;

  constructor(private signInService: OktaSignInService,
              private authService: OidcAuthService,
              private formBuilder: FormBuilder,
              private store: Store<AppState>) {
  }

  ngOnInit() {
    this.loginForm = this.formBuilder.group({
      username: ['', Validators.required],
      password: ['', Validators.required],
      ssws: ['']
    });
  }

  login() {
    if (this.loginForm.invalid) {
      return;
    }
    this.signInService.signIn(this.loginForm.value)
      .subscribe(result => {
        if (this.loginForm.value.ssws) {
          localStorage.setItem('okta-ssws', this.loginForm.value.ssws);
        }
        const param = {
          sessionToken: result.sessionToken
        }
        this.authService.loginWithRedirect(param);
      });
  }

  federatedLogin() {
    const param = {
      idp: '0oa2z3gfu5XPR3E0O357'
    }
    this.authService.loginWithRedirect(param);
  }

  register() {
    window.location.href = environment.oidc.registerUri;
  }

}
