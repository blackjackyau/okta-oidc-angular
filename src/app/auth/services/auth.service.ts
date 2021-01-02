import { Inject, Injectable } from '@angular/core';

import { ReplaySubject, Subject } from 'rxjs';

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

    private userStateSubject: Subject<oidcClient.User> = new ReplaySubject<oidcClient.User>(1);

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

            this.userStateSubject.subscribe((user: oidcClient.User) => {
                console.info(`OidcAuthService isAuthenticated(): ${!!user}`);
                if (user) {
                    this.user = user;
                }
            });

            this.userManager = new oidcClient.UserManager(oidcConfig);

            this.userManager.events.addUserLoaded(user => {
                console.log(user);
                this.userStateSubject.next(user);
            });

            this.userManager.events.addUserUnloaded(() => {
                this.userStateSubject.next(undefined);
            });
        }
    }

    public userSubject(): Subject<oidcClient.User> {
        return this.userStateSubject;
    }

    public async isAuthenticated(): Promise<boolean> {
        if (this.user) {
            return Promise.resolve(true);
        } else {
            if (!this.userManager) {
                return Promise.resolve(false);
            } else {
                return this.userManager.getUser().then(user => {
                    this.userStateSubject.next(user);
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

    public logout() {
        console.info('OidcAuthService: logout()');
        this.userManager.signoutRedirect();
    }

    public async renew(): Promise<oidcClient.User> {
        const user = await this.userManager.signinSilent();
        return user;
    }

}