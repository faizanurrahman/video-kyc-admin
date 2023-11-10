import {ComponentFixture, TestBed} from '@angular/core/testing';

import {ActiveLoanApplicationsComponent} from './active-loan-applications.component';

describe('MyPaymentsComponent', () => {
  let component: ActiveLoanApplicationsComponent;
  let fixture: ComponentFixture<ActiveLoanApplicationsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ActiveLoanApplicationsComponent],
    })
      .compileComponents();

    fixture = TestBed.createComponent(ActiveLoanApplicationsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
