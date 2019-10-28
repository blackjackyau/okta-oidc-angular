export const environment = {
  production: true,
  oidc: {
    clientId: '0oam5zkpp9nqUwpq0356',
    issuer: 'https://dev-875318.okta.com/oauth2/default',
    redirectUri: 'https://blackjackyau.github.io/okta-oidc-angular-page',
    scope: 'openid profile email',
    responseType: 'id_token token',
    registerUri: 'https://dev-875318.okta.com/signin/register'
  }
};
