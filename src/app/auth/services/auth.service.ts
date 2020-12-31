import { Inject, Injectable } from '@angular/core';
import { Router } from '@angular/router';

import { BehaviorSubject } from 'rxjs';

import { OidcConfig } from './config';
import { OidcConfigService } from './config.service';

// http://www.typescriptlang.org/docs/handbook/namespaces-and-modules.html#introduction
// import { UserManager, UserManagerSettings, User } from 'oidc-client';
import * as oidcClient from 'oidc-client';
import { AuthProfilesService } from '../../auth-profiles/auth-profiles.service';

@Injectable({
    providedIn: 'root'
})
export class OidcAuthService {

    private authState$ = new BehaviorSubject(undefined);

    private authService: oidcClient.UserManager;

    private user: oidcClient.User;

    constructor(@Inject(OidcConfigService) private config: OidcConfig,
        private authProfilesService: AuthProfilesService,
        private router: Router) {

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
    
            this.authState$.subscribe((user: oidcClient.User) => {
                console.info('OidcAuthService isAuthenticated(): ' + !!this.user);
    
                if (user) {
                    this.user = user;
                }
            });
    
            console.log(oidcConfig);
    
            this.authService = new oidcClient.UserManager(oidcConfig);
        }

    }

    public async isAuthenticated(): Promise<boolean> {
        if (this.user) {
            return Promise.resolve(true);
        } else {
            if (!this.authService) {
                return Promise.resolve(false);
            } else {
                return this.authService.getUser().then(user => {
                    this.authState$.next(user);
                    return Promise.resolve(!!user);
                });
            }
        }
    }

    public getAccessToken(): string {
        return this.user.access_token;
    }

    public getIdToken(): string {
        return this.user.id_token;
    }

    public getUser(): oidcClient.User {
        return this.user;
    }

    public async loginWithRedirect(param?: any): Promise<void> {

        console.info('OidcAuthService: loginWithRedirect()');
        var args = undefined;
        if (param) {
            args = {
                extraQueryParams: param
            };
        }
        return this.authService.signinRedirect(args);
    }

    public async handleSigninSilentCallback(): Promise<any> {
        return this.authService.signinSilentCallback();
    }

    public async handleRedirectCallback(): Promise<void> {

        console.info('OidcAuthService: handleRedirectCallback()');

        const user = await this.authService.signinRedirectCallback();

        this.authState$.next(user);

        this.router.navigate(['/']);
    }

    public logout() {

        console.info('OidcAuthService: logout()');

        this.authState$.next(false);

        this.authService.signoutRedirect();

    }

    public async renew() {
        this.user = await this.authService.signinSilent();
        console.log(`token renew`);
        this.authState$.next(this.user);
    }

}