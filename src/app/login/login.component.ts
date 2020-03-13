import { Component, OnInit } from '@angular/core';
import { OktaSignInService } from '../okta/okta-sign-in.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { environment } from '../../environments/environment';
import { Store } from '@ngrx/store';
import { AppState } from '../state/app.state';
import { OidcSecurityService } from 'angular-auth-oidc-client';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  loginForm: FormGroup;

  isSubmitted = false;

  constructor(private oidcSecurityService: OidcSecurityService,
              private signInService: OktaSignInService,
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
        this.signInService.signInRedirectPKCEAuthCode(result.sessionToken);
      });
  }

  federatedSaml2Login() {
    this.signInService.signInSaml2FederatedIdpRedirectPKCEAuthCode();
  }

  federatedOidcLogin() {
    this.signInService.signInOidcFederatedIdpRedirectPKCEAuthCode();
  }

  federatedKeyCloakOidcLogin() {
    this.oidcSecurityService.setCustomRequestParameters({
      "kc_idp_hint": "saml"
    });
    this.oidcSecurityService.authorize();
  }

  register() {
    window.location.href = environment.oidc.registerUri;
  }

}
