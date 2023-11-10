import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LoanPaymentFailureComponent } from './loan-payment-failure.component';

describe('LoanPaymentFailureComponent', () => {
  let component: LoanPaymentFailureComponent;
  let fixture: ComponentFixture<LoanPaymentFailureComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LoanPaymentFailureComponent],
    })
      .compileComponents();

    fixture = TestBed.createComponent(LoanPaymentFailureComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
