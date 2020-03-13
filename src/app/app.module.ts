import { BrowserModule } from '@angular/platform-browser';
import { NgModule, APP_INITIALIZER } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { CookieService } from 'ngx-cookie-service';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { reducer as userReducer } from './user/state/user.reducer';

import {
  OKTA_CONFIG,
  OktaAuthModule,
} from '@okta/okta-angular';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';
import { HomeComponent } from './home/home.component';
import { AppMaterialModule } from './app-material.module';
import { StoreModule, Store } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';

import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { environment } from '../environments/environment';
import { LogoutComponent } from './logout/logout.component';
import { CurrentUserEffects, SSWSEffects } from './user/state/user.effect';
import { AuthModule, ConfigResult, OidcConfigService, OidcSecurityService, OpenIdConfiguration } from 'angular-auth-oidc-client';
import { AppSharedModule } from './app-shared.module';
import { AuthCallbackComponent } from './auth-callback/auth-callback.component';

const oidc_configuration = 'assets/auth.clientConfiguration.json';
export function loadConfig(oidcConfigService: OidcConfigService) {
  return () => oidcConfigService.load(oidc_configuration);
}

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
    AuthCallbackComponent,
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
    AppSharedModule,
    StoreModule.forRoot({user: userReducer}),
    StoreDevtoolsModule.instrument({
      name: 'Okta Oidc',
      maxAge: 25,
      logOnly: environment.production
    }),
    EffectsModule.forRoot([CurrentUserEffects, SSWSEffects]),
    AuthModule.forRoot(),
  ],
  providers: [
    OidcConfigService,
    {
        provide: APP_INITIALIZER,
        useFactory: loadConfig,
        deps: [OidcConfigService],
        multi: true,
    },
    { provide: OKTA_CONFIG, useValue: oktaConfigData },
    CookieService
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
  constructor(private oidcSecurityService: OidcSecurityService, private oidcConfigService: OidcConfigService) {
    this.oidcConfigService.onConfigurationLoaded.subscribe((configResult: ConfigResult) => {

        // Use the configResult to set the configurations
  
        const config: OpenIdConfiguration = {
            stsServer: configResult.customConfig.stsServer,
            redirect_url: 'http://localhost:4200',
            client_id: 'ExperianONE USECASE JOURNEY',
            scope: 'openid profile email',
            response_type: 'code',
            post_logout_redirect_uri: "http://localhost:4200",
            silent_renew: true,
            silent_renew_url: 'https://localhost:4200/silent-renew.html',
            log_console_debug_active: true,
            trigger_authorization_result_event: true
            // all other properties you want to set
        };

        this.oidcSecurityService.setupModule(config, configResult.authWellknownEndpoints);
    });
}
}
