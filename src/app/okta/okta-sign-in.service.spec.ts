import { TestBed } from '@angular/core/testing';

import { OktaSignInService } from './okta-sign-in.service';

describe('OktaSignInService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: OktaSignInService = TestBed.get(OktaSignInService);
    expect(service).toBeTruthy();
  });
});
