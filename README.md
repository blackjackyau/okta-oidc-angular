[![Actions Status](https://github.com/blackjackyau/okta-oidc-angular/workflows/Node%20CI/badge.svg)](https://github.com/blackjackyau/okta-oidc-angular/actions)

# OktaOidcAngularNgRx

## Public client with Implicit grant
```typescript
  async signInRedirectImplicit(sessionToken: string) {
    const params = {
      responseType: ['id_token', 'token'],
      sessionToken, // session token is required to pass during the auth service, if not it will call okta
    };
    await this.authService.loginRedirect(undefined, params);
  }
```

## Public client with Auth Code PKCE

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

### On authorization URL
- code_challenge: znenlxKPjR5jJ2_f5QqyoG6fc1Z8JoOzEHhPCw1JMbg
- code_challenge_method: S256

### On token URL with access token grant
- code_verifier: 8a5aa15cf688a1613cf031356f16f72ec90f6f7c6d4

### Formula
- S256 = SHA256
- code_challenge = Base64(code_challenge_method(code_verifier)), where code_verifier is random generated
