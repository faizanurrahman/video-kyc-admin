import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LoanStatementsComponent } from './loan-statements.component';

describe('LoanStatementsComponent', () => {
  let component: LoanStatementsComponent;
  let fixture: ComponentFixture<LoanStatementsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LoanStatementsComponent],
    })
      .compileComponents();

    fixture = TestBed.createComponent(LoanStatementsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
