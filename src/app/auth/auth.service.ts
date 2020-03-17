import { Inject, Injectable } from '@angular/core';
import { Router } from '@angular/router';

import { BehaviorSubject } from 'rxjs';

import { OidcConfig } from './config';
import { OidcConfigService } from './config.service';

// http://www.typescriptlang.org/docs/handbook/namespaces-and-modules.html#introduction
// import { UserManager, UserManagerSettings, User } from 'oidc-client';
import * as oidcClient from 'oidc-client';
import { resolve } from 'url';

@Injectable({
    providedIn: 'root'
})
export class OidcAuthService {

    private authState$ = new BehaviorSubject(false);

    private authService: oidcClient.UserManager;

    private currentUser: any;

    private idToken = '';
    private accessToken = '';

    private authenticated = false;

    constructor(@Inject(OidcConfigService) private config: OidcConfig,
        private router: Router) {

        console.info('OidcAuthService: constructor()');

        this.currentUser = null;

        const oidcConfig: oidcClient.UserManagerSettings = {
            authority: this.config.issuer,
            client_id: this.config.clientId,
            redirect_uri: this.config.redirectUri,
            post_logout_redirect_uri: this.config.postLogoutRedirectUri,
            response_type: this.config.responseType,
            scope: this.config.scope,
            filterProtocolClaims: this.config.filterProtocolClaims,
            loadUserInfo: this.config.loadUserInfo,
            extraQueryParams: this.config.extraQueryParams
        };

        this.authService = new oidcClient.UserManager(oidcConfig);

        this.authState$.subscribe((authenticated: boolean) => {
            console.info('OidcAuthService isAuthenticated(): ' + this.authenticated);

            this.authenticated = authenticated;

            if (this.authenticated) {
                this.setAccessToken();
                console.info('OidcAuthService idToken: ' + this.idToken);
                console.info('OidcAuthService accessToken: ' + this.accessToken);
            }
        });
    }

    public async isAuthenticatedAsync(): Promise<boolean> {
        console.log(`isAuthenticatedAsync is called`);
        return this.authService.getUser().then(user => {
            this.currentUser = user;
            this.authState$.next(!!user);
            return Promise.resolve(!!user);
        })
    }

    public isAuthenticated(): boolean {
        return this.authenticated;
    }

    public getAccessToken(): string {
        return this.accessToken;
    }

    public getIdToken(): string {
        return this.idToken;
    }

    public getCurrentUser(): {
        id: string;
        sub: string;
        username: string;
        name: string;
        givenName: string;
        middleName: string;
        familyName: string;
        email: string;
        emailVerified: string;
    } {
        return {
            id: this.currentUser.profile.sub,
            sub: this.currentUser.profile.sub,
            username: this.currentUser.profile.preferred_username,
            name: this.currentUser.profile.name,
            givenName: this.currentUser.profile.given_name,
            middleName: '',
            familyName: this.currentUser.profile.family_name,
            email: this.currentUser.profile.email,
            emailVerified: this.currentUser.profile.email_verified,
        };
    }

    private setAccessToken() {
        this.idToken = this.currentUser.id_token;
        this.accessToken = this.currentUser.access_token;
    }

    public async loginWithRedirect(args?: any): Promise<void> {

        console.info('OidcAuthService: loginWithRedirect()');

        return this.authService.signinRedirect(args);
    }

    public async handleRedirectCallback(): Promise<void> {

        console.info('OidcAuthService: handleRedirectCallback()');

        this.currentUser = await this.authService.signinRedirectCallback();

        console.info('currentUser: ' + JSON.stringify(this.currentUser, null, 2));

        this.authenticated = await this._isAuthenticated();

        this.authState$.next(this.authenticated);

        this.router.navigate(['/']);
    }

    public logout() {

        console.info('OidcAuthService: logout()');

        this.authState$.next(false);

        this.authService.signoutRedirect();
    }

    //
    // Private methods
    //

    private async _isAuthenticated(): Promise<boolean> {

        return this.currentUser !== null && !this.currentUser.expired;
    }

}