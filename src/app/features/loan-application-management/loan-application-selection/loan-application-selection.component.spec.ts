import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LoanApplicationSelectionComponent } from './loan-application-selection.component';

describe('LoanApplicationSelectionComponent', () => {
  let component: LoanApplicationSelectionComponent;
  let fixture: ComponentFixture<LoanApplicationSelectionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LoanApplicationSelectionComponent],
    })
      .compileComponents();

    fixture = TestBed.createComponent(LoanApplicationSelectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
