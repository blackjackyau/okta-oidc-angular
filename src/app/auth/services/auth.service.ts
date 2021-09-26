import { Inject, Injectable } from '@angular/core';

import { from, Observable, of } from 'rxjs';

import { OidcConfig } from './config';
import { OidcConfigService } from './config.service';

// http://www.typescriptlang.org/docs/handbook/namespaces-and-modules.html#introduction
// import { UserManager, UserManagerSettings, User } from 'oidc-client';
import * as oidcClient from 'oidc-client';
import { AuthProfilesService } from '../../auth-profiles/auth-profiles.service';
import { map, tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class OidcAuthService {

  private userManager: oidcClient.UserManager;

  private user: oidcClient.User;

  constructor(@Inject(OidcConfigService) private config: OidcConfig,
    private authProfilesService: AuthProfilesService) {

    console.info('OidcAuthService: constructor()');

    const authProfile = this.authProfilesService.getActiveProfile();

    if (authProfile) {
      const effectiveOidcConfig = Object.assign({}, this.config, authProfile.oidc);

      const oidcConfig: oidcClient.UserManagerSettings = {
        authority: effectiveOidcConfig.issuer,
        client_id: effectiveOidcConfig.clientId,
        redirect_uri: effectiveOidcConfig.redirectUri,
        post_logout_redirect_uri: effectiveOidcConfig.postLogoutRedirectUri,
        silent_redirect_uri: effectiveOidcConfig.silentRedirectUri,
        includeIdTokenInSilentRenew: true,
        response_type: effectiveOidcConfig.responseType,
        scope: effectiveOidcConfig.scope,
        filterProtocolClaims: effectiveOidcConfig.filterProtocolClaims,
        loadUserInfo: effectiveOidcConfig.loadUserInfo
      };

      this.userManager = new oidcClient.UserManager(oidcConfig);

      this.userManager.events.addUserLoaded(user => {
        this.user = user;
      });

      this.userManager.events.addUserUnloaded(() => {
        this.user = undefined
      });

    }
  }

  public user$(): Observable<oidcClient.User> {
    if (this.user) {
      return of(this.user);
    } else {
      if (this.userManager) {
        return from(this.userManager.getUser()).pipe(
          tap(user => {
            this.user = user;
          })
        );
      } else {
        return of(undefined);
      }
    }
  }

  public isAuthenticated$(): Observable<boolean> {
    return this.user$().pipe(
      map(user => !!user)
    )
  }

  public async loginWithRedirect(param?: any): Promise<void> {

    console.info('OidcAuthService: loginWithRedirect()');
    var args = undefined;
    if (param) {
      args = {
        extraQueryParams: param
      };
    }
    return this.userManager.signinRedirect(args);
  }

  public async handleSigninSilentCallback(): Promise<oidcClient.User> {
    console.info('OidcAuthService: handleSigninSilentCallback()');
    const user = await this.userManager.signinSilentCallback();
    return user;
  }

  public async handleRedirectCallback(): Promise<oidcClient.User> {
    console.info('OidcAuthService: handleRedirectCallback()');
    const user = await this.userManager.signinRedirectCallback();
    return user;
  }

  public logout(): Promise<void> {
    return this.userManager.signoutRedirect();
  }

  public async renew(): Promise<oidcClient.User> {
    return await this.userManager.signinSilent();
  }
}