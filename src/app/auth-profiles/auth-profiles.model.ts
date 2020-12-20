export interface AuthProfileData {
  profiles: AuthProfile[];
  selected: string;
};

export interface AuthProfile {
  id: string;
  name: string;
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