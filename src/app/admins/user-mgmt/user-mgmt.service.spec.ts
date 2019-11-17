import { TestBed } from '@angular/core/testing';

import { UserMgmtService } from './user-mgmt.service';

describe('UsersService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: UserMgmtService = TestBed.get(UserMgmtService);
    expect(service).toBeTruthy();
  });
});
