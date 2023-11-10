import { TestBed } from '@angular/core/testing';

import { LoanStatementService } from './services/loan-statement.service';

describe('LoanStatementService', () => {
  let service: LoanStatementService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(LoanStatementService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
