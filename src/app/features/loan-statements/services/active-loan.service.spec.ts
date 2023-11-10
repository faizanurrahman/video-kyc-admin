import { TestBed } from '@angular/core/testing';

import { ActiveLoanService } from './active-loan.service';

describe('ActiveLoanService', () => {
  let service: ActiveLoanService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ActiveLoanService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
