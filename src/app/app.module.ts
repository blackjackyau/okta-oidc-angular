import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { CookieService } from 'ngx-cookie-service';
import { FormsModule, ReactiveFormsModule} from '@angular/forms';

import {
  OKTA_CONFIG,
  OktaAuthModule
} from '@okta/okta-angular';
import oktaConfig from './.okta.config';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';

const oktaConfigData = Object.assign({
  onAuthRequired: ({ oktaAuth, router }) => {
    console.log('here here');
    router.navigate(['/login']);
  }
}, oktaConfig.oidc);

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    OktaAuthModule,
    HttpClientModule,
    AppRoutingModule
  ],
  providers: [
    { provide: OKTA_CONFIG, useValue: oktaConfigData },
    CookieService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
