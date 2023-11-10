import { TestBed } from '@angular/core/testing';

import { SessionManagementInterceptor } from './session-management.interceptor';

describe('SessionManagementInterceptor', () => {
  beforeEach(() => TestBed.configureTestingModule({
    providers: [
      SessionManagementInterceptor,
    ],
  }));

  it('should be created', () => {
    const interceptor: SessionManagementInterceptor = TestBed.inject(SessionManagementInterceptor);
    expect(interceptor).toBeTruthy();
  });
});
