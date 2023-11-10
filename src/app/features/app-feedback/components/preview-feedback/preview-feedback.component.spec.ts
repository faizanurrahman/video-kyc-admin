import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PreviewFeedbackComponent } from './preview-feedback.component';

describe('PreviewFeedbackComponent', () => {
  let component: PreviewFeedbackComponent;
  let fixture: ComponentFixture<PreviewFeedbackComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PreviewFeedbackComponent],
    })
      .compileComponents();

    fixture = TestBed.createComponent(PreviewFeedbackComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
