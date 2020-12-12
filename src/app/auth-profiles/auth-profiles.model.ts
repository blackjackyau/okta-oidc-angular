export interface AuthProfileData {
  profiles: AuthProfile[];
  selected: number;
};

export interface AuthProfile {
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