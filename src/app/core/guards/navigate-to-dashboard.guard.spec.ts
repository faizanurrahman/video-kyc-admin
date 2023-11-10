import { TestBed } from '@angular/core/testing';

import { NavigateToDashboardGuard } from './navigate-to-dashboard.guard';

describe('NavigateToDashboardGuard', () => {
  let guard: NavigateToDashboardGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    guard = TestBed.inject(NavigateToDashboardGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
