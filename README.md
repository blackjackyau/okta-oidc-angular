[![Actions Status](https://github.com/blackjackyau/okta-oidc-angular/workflows/Node%20CI/badge.svg)](https://github.com/blackjackyau/okta-oidc-angular/actions)

# OktaOidcAngular
Single Page Application type of OIDC flow (Public Client with Auth Code PKCE) with OKTA as IdP

## Hosted environment
- git repo [(link)](https://github.com/blackjackyau/okta-oidc-angular-page)
- git page [(link)](https://blackjackyau.github.io/okta-oidc-angular-page/)

## Features
- multiple auth profiles for different IdP testings
- Support custom login page instead of IdP login page (OKTA only)
- Support Federated Identity login (OKTA and Keycloak) [`idp` for okta, `idp_hint` for keycloak]
- Support generic oidc auth code grant with PKCE flow

### Can refer to the medium page for the detail setup of a federated idp from OKTA [(link)](https://ysyau.medium.com/okta-oidc-federated-idp-setup-with-saml-2-0-demo-project-f88fb4153ec5)

---

## Additional Details

### Public client with Implicit grant
```typescript
  async signInRedirectImplicit(sessionToken: string) {
    const params = {
      responseType: ['id_token', 'token'],
      sessionToken, // session token is required to pass during the auth service, if not it will call okta
    };
    await this.authService.loginRedirect(undefined, params);
  }
```

### Public client with Auth Code PKCE

``` typescript
  async signInRedirectPKCEAuthCode(sessionToken: string) {
    const params = {
      responseType: ['code'],
      sessionToken, // session token is required to pass during the auth service, if not it will call okta
      pkce: true
    };
    await this.authService.loginRedirect(undefined, params);
  }
```

#### On authorization URL
- code_challenge: znenlxKPjR5jJ2_f5QqyoG6fc1Z8JoOzEHhPCw1JMbg
- code_challenge_method: S256

#### On token URL with access token grant
- code_verifier: 8a5aa15cf688a1613cf031356f16f72ec90f6f7c6d4

#### Formula
- S256 = SHA256
- code_challenge = Base64(code_challenge_method(code_verifier)), where code_verifier is random generated
