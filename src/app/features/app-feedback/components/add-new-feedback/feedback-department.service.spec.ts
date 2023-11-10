import { TestBed } from '@angular/core/testing';

import { FeedbackDepartmentService } from './feedback-department.service';

describe('FeedbackDepartmentService', () => {
  let service: FeedbackDepartmentService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FeedbackDepartmentService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
