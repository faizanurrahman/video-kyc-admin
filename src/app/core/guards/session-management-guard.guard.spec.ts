import { TestBed } from '@angular/core/testing';

import { SessionManagementGuardGuard } from './session-management-guard.guard';

describe('SessionManagementGuardGuard', () => {
  let guard: SessionManagementGuardGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    guard = TestBed.inject(SessionManagementGuardGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
