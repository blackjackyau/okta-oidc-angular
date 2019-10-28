import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { CookieService } from 'ngx-cookie-service';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { reducer as userReducer } from './user/state/user.reducer';
import { reducer as userMgmtReducer } from './users/state/users.reducer';

import {
  OKTA_CONFIG,
  OktaAuthModule
} from '@okta/okta-angular';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';
import { HomeComponent } from './home/home.component';
import { AppMaterialModule } from './app-material.module';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';

import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { environment } from '../environments/environment';
import { LogoutComponent } from './logout/logout.component';
import { UsersComponent } from './users/users.component';
import { UsersEffects } from './users/state/users.effect';


const oktaConfigData = Object.assign({
  onAuthRequired: ({ oktaAuth, router }) => {
    console.log('here here');
    router.navigate(['/login']);
  }
}, environment.oidc);

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    LogoutComponent,
    HomeComponent,
    UsersComponent,
  ],
  imports: [
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    OktaAuthModule,
    HttpClientModule,
    BrowserAnimationsModule,
    AppMaterialModule,
    AppRoutingModule,
    StoreModule.forRoot({user: userReducer, userMgmt: userMgmtReducer}),
    StoreDevtoolsModule.instrument({
      name: 'Okta Oidc',
      maxAge: 25,
      logOnly: environment.production
    }),
    EffectsModule.forRoot([UsersEffects])
  ],
  providers: [
    { provide: OKTA_CONFIG, useValue: oktaConfigData },
    CookieService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
