import { TestBed } from '@angular/core/testing';

import { SessionManagementGuard } from './session-management.guard';

describe('SessionManagementGuard', () => {
  let guard: SessionManagementGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    guard = TestBed.inject(SessionManagementGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
