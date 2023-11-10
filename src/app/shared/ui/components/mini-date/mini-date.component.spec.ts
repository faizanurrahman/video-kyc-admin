import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MiniDateComponent } from './mini-date.component';

describe('MiniDateComponent', () => {
  let component: MiniDateComponent;
  let fixture: ComponentFixture<MiniDateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MiniDateComponent],
    })
      .compileComponents();

    fixture = TestBed.createComponent(MiniDateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
