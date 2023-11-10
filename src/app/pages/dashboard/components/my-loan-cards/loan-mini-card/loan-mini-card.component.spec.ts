import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LoanMiniCardComponent } from './loan-mini-card.component';

describe('LoanMiniCardComponent', () => {
  let component: LoanMiniCardComponent;
  let fixture: ComponentFixture<LoanMiniCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LoanMiniCardComponent],
    })
      .compileComponents();

    fixture = TestBed.createComponent(LoanMiniCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
