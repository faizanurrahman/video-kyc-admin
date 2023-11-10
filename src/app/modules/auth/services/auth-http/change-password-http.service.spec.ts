import { TestBed } from '@angular/core/testing';

import { ChangePasswordHttpService } from './change-password-http.service';

describe('ChangePasswordHttpService', () => {
  let service: ChangePasswordHttpService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ChangePasswordHttpService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
