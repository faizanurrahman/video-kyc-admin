import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PlayButtonPrimaryComponent } from './play-button-primary.component';

describe('PlayButtonPrimaryComponent', () => {
  let component: PlayButtonPrimaryComponent;
  let fixture: ComponentFixture<PlayButtonPrimaryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PlayButtonPrimaryComponent],
    })
      .compileComponents();

    fixture = TestBed.createComponent(PlayButtonPrimaryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
