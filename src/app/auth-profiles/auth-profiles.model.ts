export interface AuthProfile {
  oktaUrl: string;
  oidc: {
    clientId: string;
    issuer: string;
    scope: string;
  },
  federatedIdps: FederatedIdP[];
};

export interface FederatedIdP {
  name: string;
  id: string;
}