import { TestBed } from '@angular/core/testing';

import { LitehiresGuardGuard } from './litehires-guard.guard';

describe('LitehiresGuardGuard', () => {
  let guard: LitehiresGuardGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    guard = TestBed.inject(LitehiresGuardGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
