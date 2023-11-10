import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PlayButtonSecondaryComponent } from './play-button-secondary.component';

describe('PlayButtonSecondaryComponent', () => {
  let component: PlayButtonSecondaryComponent;
  let fixture: ComponentFixture<PlayButtonSecondaryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PlayButtonSecondaryComponent],
    })
      .compileComponents();

    fixture = TestBed.createComponent(PlayButtonSecondaryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
