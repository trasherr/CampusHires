import { TestBed } from '@angular/core/testing';

import { CampusHiresGuardGuard } from './campusHires-guard.guard';

describe('CampusHiresGuardGuard', () => {
  let guard: CampusHiresGuardGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    guard = TestBed.inject(CampusHiresGuardGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
