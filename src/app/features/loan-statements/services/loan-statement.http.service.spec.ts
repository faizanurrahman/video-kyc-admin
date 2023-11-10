import { TestBed } from '@angular/core/testing';

import { LoanStatementHttpService } from './loan-statement.http.service';

describe('LoanStatementHttpService', () => {
  let service: LoanStatementHttpService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(LoanStatementHttpService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
