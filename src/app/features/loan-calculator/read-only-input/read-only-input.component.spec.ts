import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReadOnlyInputComponent } from './read-only-input.component';

describe('ReadOnlyInputComponent', () => {
  let component: ReadOnlyInputComponent;
  let fixture: ComponentFixture<ReadOnlyInputComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReadOnlyInputComponent],
    })
      .compileComponents();

    fixture = TestBed.createComponent(ReadOnlyInputComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
