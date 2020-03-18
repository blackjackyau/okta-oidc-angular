export const environment = {
  production: true,
  oktaUrl: 'https://dev-875318.okta.com',
  oidc: {
    clientId: '0oam5zkpp9nqUwpq0356',
    issuer: 'https://dev-875318.okta.com/oauth2/default',
    redirectUri: 'https://blackjackyau.github.io/okta-oidc-angular-page',
    silentRedirectUri: 'https://blackjackyau.github.io/okta-oidc-angular-page',
    scope: 'openid profile email',
    responseType: 'code',
    registerUri: 'https://dev-875318.okta.com/signin/register',
    postLogoutRedirectUri: 'https://blackjackyau.github.io/okta-oidc-angular-page'
  }
};
