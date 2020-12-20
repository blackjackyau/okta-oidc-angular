export const environment = {
  production: true,
  oktaUrl: '',
  oidc: {
    clientId: '',
    issuer: '',
    redirectUri: 'https://blackjackyau.github.io/okta-oidc-angular-page',
    silentRedirectUri: 'https://blackjackyau.github.io/okta-oidc-angular-page',
    scope: 'openid profile email',
    responseType: 'code',
    registerUri: '',
    postLogoutRedirectUri: 'https://blackjackyau.github.io/okta-oidc-angular-page'
  }
};