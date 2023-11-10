import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LoanPaymentCallbackComponent } from './loan-payment-callback.component';

describe('LoanPaymentCallbackComponent', () => {
  let component: LoanPaymentCallbackComponent;
  let fixture: ComponentFixture<LoanPaymentCallbackComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LoanPaymentCallbackComponent],
    })
      .compileComponents();

    fixture = TestBed.createComponent(LoanPaymentCallbackComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
