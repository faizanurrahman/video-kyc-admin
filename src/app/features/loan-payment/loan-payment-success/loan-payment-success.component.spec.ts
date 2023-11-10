import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LoanPaymentSuccessComponent } from './loan-payment-success.component';

describe('LoanPaymentSuccessComponent', () => {
  let component: LoanPaymentSuccessComponent;
  let fixture: ComponentFixture<LoanPaymentSuccessComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LoanPaymentSuccessComponent],
    })
      .compileComponents();

    fixture = TestBed.createComponent(LoanPaymentSuccessComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
