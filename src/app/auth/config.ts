export interface OidcConfig {
  
    // https://github.com/IdentityModel/oidc-client-js
  
    clientId: string,               // client_id
    filterProtocolClaims?: boolean, // filterProtocolClaims
    silentRedirectUri: string,

    grantType?: string,
    issuer: string,                 // authority

    loadUserInfo?: boolean,         // loadUserInfo
    postLogoutRedirectUri?: string, // post_logout_redirect_uri

    redirectUri: string,            // redirect_uri
    responseType: string,           // response_type
    scope: string,                  // scope
    extraQueryParams: any;
  }