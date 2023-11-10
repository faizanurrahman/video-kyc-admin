import { TestBed } from '@angular/core/testing';

import { AppFeedbackHttpService } from './app-feedback.http.service';

describe('AppFeedbackHttpService', () => {
  let service: AppFeedbackHttpService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AppFeedbackHttpService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
