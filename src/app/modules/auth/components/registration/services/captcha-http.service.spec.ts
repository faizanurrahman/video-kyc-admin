import { TestBed } from '@angular/core/testing';

import { CaptchaHttpService } from './captcha-http.service';

describe('CaptchaHttpService', () => {
  let service: CaptchaHttpService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CaptchaHttpService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
