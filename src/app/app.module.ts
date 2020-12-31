import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { CookieService } from 'ngx-cookie-service';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
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
import { AppSharedModule } from './app-shared.module';
import { OidcConfigService } from './auth/services/config.service';
import { AuthCallbackComponent } from './auth-callback/auth-callback.component';
import { AuthProfilesComponent } from './auth-profiles/auth-profiles.component';
import { ConfirmationDialogComponent } from './confirmation-dialog/confirmation-dialog.component';
import { ROOT_REDUCERS, metaReducers } from './reducers';
import { SessionEffects } from './auth/effects/user.effects';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    LogoutComponent,
    HomeComponent,
    AuthCallbackComponent,
    AuthProfilesComponent,
    ConfirmationDialogComponent,
  ],
  imports: [
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    BrowserAnimationsModule,
    AppMaterialModule,
    AppRoutingModule,
    AppSharedModule,
    StoreModule.forRoot(ROOT_REDUCERS, {
      metaReducers,
      runtimeChecks: {
        // strictStateImmutability and strictActionImmutability are enabled by default
        strictStateSerializability: true,
        strictActionSerializability: true,
        strictStateImmutability: true,
        strictActionImmutability: true,
      },
    }),
    StoreDevtoolsModule.instrument({
      name: 'Okta Oidc',
      maxAge: 25,
      logOnly: environment.production
    }),
    EffectsModule.forRoot([SessionEffects])
  ],
  providers: [
    { provide: OidcConfigService, useValue: environment.oidc },
    CookieService,
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
