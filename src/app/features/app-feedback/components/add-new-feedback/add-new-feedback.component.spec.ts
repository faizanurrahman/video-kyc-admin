import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddNewFeedbackComponent } from './add-new-feedback.component';

describe('AddNewFeedbackComponent', () => {
  let component: AddNewFeedbackComponent;
  let fixture: ComponentFixture<AddNewFeedbackComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddNewFeedbackComponent],
    })
      .compileComponents();

    fixture = TestBed.createComponent(AddNewFeedbackComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
