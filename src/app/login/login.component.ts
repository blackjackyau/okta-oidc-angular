import { Component, OnInit } from '@angular/core';
import { OktaSignInService } from '../okta/okta-sign-in.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { environment } from '../../environments/environment';
import { OidcAuthService } from '../auth/auth.service';
import { AuthProfilesService } from '../auth-profiles/auth-profiles.service';
import { AuthProfile, FederatedIdP } from '../auth-profiles/auth-profiles.model';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  loginForm: FormGroup;

  isSubmitted = false;

  activeAuthProfile: AuthProfile;

  supportCustomUILogin = false;

  constructor(private signInService: OktaSignInService,
    private authService: OidcAuthService,
    private formBuilder: FormBuilder,
    private authProfilesService: AuthProfilesService) {
    this.activeAuthProfile = this.authProfilesService.getActiveProfile();
    this.supportCustomUILogin = !!this.activeAuthProfile.oktaUrl;
  }

  ngOnInit() {
    this.loginForm = this.formBuilder.group({
      username: ['', Validators.required],
      password: ['', Validators.required],
      ssws: ['']
    });
  }

  customUILogin() {
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

  login() {
    this.authService.loginWithRedirect();
  }

  federatedLogin(federatedIdp: FederatedIdP) {
    const param = {
      idp: federatedIdp.id
    }
    this.authService.loginWithRedirect(param);
  }

  register() {
    window.location.href = environment.oidc.registerUri;
  }

}
