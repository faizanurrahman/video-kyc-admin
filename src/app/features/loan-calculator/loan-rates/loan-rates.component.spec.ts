import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LoanRatesComponent } from './loan-rates.component';

describe('LoanRatesComponent', () => {
  let component: LoanRatesComponent;
  let fixture: ComponentFixture<LoanRatesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ LoanRatesComponent ],
    })
      .compileComponents();

    fixture = TestBed.createComponent(LoanRatesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
