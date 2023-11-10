import { TestBed } from '@angular/core/testing';

import { AppFeedbackService } from './app-feedback.service';

describe('AppFeedbackService', () => {
  let service: AppFeedbackService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AppFeedbackService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
