import { Component, OnInit } from '@angular/core';
import { OktaAuthService } from '@okta/okta-angular';
import { OktaSignInService } from '../okta/okta-sign-in.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  isAuthenticated: boolean;

  userName: string;

  loginForm: FormGroup;

  isSubmitted = false;

  constructor(private authService: OktaAuthService,
              private signInService: OktaSignInService,
              private formBuilder: FormBuilder) {
    this.authService.$authenticationState.subscribe(isAuthenticated => this.isAuthenticated = isAuthenticated);
  }

  async ngOnInit() {
    this.loginForm = this.formBuilder.group({
      username: ['', Validators.required],
      password: ['', Validators.required]
    });
    this.isAuthenticated = await this.authService.isAuthenticated();
    if (this.isAuthenticated) {
      const userClaims = await this.authService.getUser();
      this.userName = userClaims.name;
    }
  }

  logout() {
    this.authService.logout('/');
  }

  login() {
    if (this.loginForm.invalid) {
      return;
    }
    console.log(this.loginForm.value);

    this.signInService.signIn(this.loginForm.value)
      .subscribe(result => {
        this.signInService.signInRedirect(result.sessionToken);
      });
  }

}
